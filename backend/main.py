import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import Client, create_client

load_dotenv(Path(__file__).with_name(".env"))

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
if not supabase_url or not supabase_key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be configured")

supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI(title="StokWise API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionCreate(BaseModel):
    product_id: str
    type: Literal["sale", "purchase"]
    quantity: int = Field(gt=0)

class ProductCreate(BaseModel):
    name: str = Field(min_length=2)
    category: str = "Lainnya"
    unit: str = "unit"
    current_stock: int = Field(ge=0)
    minimum_stock: int = Field(ge=0)
    unit_cost: int = Field(ge=0)


def days_until_stockout(product: dict) -> float | None:
    sales = product["average_daily_sales"]
    return round(product["current_stock"] / sales, 1) if sales else None


def product_status(product: dict) -> str:
    days = days_until_stockout(product)
    if days is not None and days <= 3:
        return "critical"
    if product["current_stock"] <= product["minimum_stock"]:
        return "warning"
    return "healthy"


def build_product(product: dict) -> dict:
    normalized = {
        **product,
        "average_daily_sales": product.get("average_daily_sales") or 0,
        "trend": product.get("trend") or 0,
        "color": product.get("color") or "blue",
    }
    return {
        **normalized,
        "days_until_stockout": days_until_stockout(normalized),
        "status": product_status(normalized),
    }


def database_error(action: str) -> HTTPException:
    return HTTPException(status_code=502, detail=f"Gagal {action} di Supabase")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/products")
def list_products() -> list[dict]:
    try:
        rows = supabase.table("products").select("*").order("name").execute().data
        return [build_product(product) for product in rows]
    except Exception as error:
        raise database_error("mengambil produk") from error


@app.post("/api/products", status_code=201)
def create_product(payload: ProductCreate) -> dict:
    product = {
        **payload.model_dump(),
        "average_daily_sales": 0,
        "trend": 0,
        "color": "blue",
    }
    try:
        result = supabase.table("products").insert(product).execute()
        if not result.data:
            raise HTTPException(status_code=502, detail="Produk tidak dikembalikan Supabase")
        return build_product(result.data[0])
    except HTTPException:
        raise
    except Exception as error:
        raise database_error("menyimpan produk") from error


@app.post("/api/inventory/transactions", status_code=201)
def create_transaction(payload: TransactionCreate) -> dict:
    try:
        result = (
            supabase.table("products")
            .select("*")
            .eq("id", payload.product_id)
            .limit(1)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan")

        product = result.data[0]
        stock_change = payload.quantity if payload.type == "purchase" else -payload.quantity
        updated_stock = product["current_stock"] + stock_change
        if updated_stock < 0:
            raise HTTPException(status_code=400, detail="Stok tidak mencukupi")

        updated = (
            supabase.table("products")
            .update({"current_stock": updated_stock})
            .eq("id", payload.product_id)
            .execute()
        )
        if not updated.data:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
        supabase.table("inventory_transactions").insert(
            {
                "product_id": payload.product_id,
                "transaction_type": payload.type,
                "quantity": payload.quantity,
            }
        ).execute()
        return build_product(updated.data[0])
    except HTTPException:
        raise
    except Exception as error:
        raise database_error("mencatat transaksi") from error


@app.get("/api/dashboard")
def dashboard() -> dict:
    enriched = list_products()
    critical = [product for product in enriched if product["status"] == "critical"]
    warning = [product for product in enriched if product["status"] == "warning"]
    return {
        "products": enriched,
        "stats": {
            "total_products": len(enriched),
            "critical_count": len(critical),
            "inventory_value": sum(product["current_stock"] * product["unit_cost"] for product in enriched),
            "monthly_spend": 8_420_000,
        },
        "alerts": critical + warning,
        "insight": {
            "title": "Permintaan minyak goreng naik 30% minggu ini",
            "body": "Stok diperkirakan habis dalam 2,5 hari. Pertimbangkan restock 48 botol untuk menjaga persediaan selama satu minggu.",
            "product_id": "prod-1",
        },
        "sales": [120, 145, 132, 168, 176, 194, 218],
    }


@app.get("/api/suppliers")
def list_suppliers(category: str | None = None) -> list[dict]:
    try:
        query = supabase.table("suppliers").select("*").order("name")
        if category is not None:
            query = query.eq("category", category)
        return query.execute().data
    except Exception as error:
        raise database_error("mengambil supplier") from error
