from datetime import date, timedelta
from math import asin, cos, radians, sin, sqrt
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="StokWise API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

products = [
    {
        "id": "prod-1",
        "name": "Minyak Goreng 2L",
        "category": "Bahan pokok",
        "unit": "botol",
        "current_stock": 20,
        "minimum_stock": 30,
        "average_daily_sales": 8.0,
        "unit_cost": 31_500,
        "trend": 30,
        "color": "yellow",
    },
    {
        "id": "prod-2",
        "name": "Beras Premium 5kg",
        "category": "Bahan pokok",
        "unit": "karung",
        "current_stock": 64,
        "minimum_stock": 25,
        "average_daily_sales": 5.2,
        "unit_cost": 76_000,
        "trend": 8,
        "color": "green",
    },
    {
        "id": "prod-3",
        "name": "Gula Pasir 1kg",
        "category": "Bahan pokok",
        "unit": "pak",
        "current_stock": 12,
        "minimum_stock": 20,
        "average_daily_sales": 4.0,
        "unit_cost": 17_500,
        "trend": -4,
        "color": "red",
    },
    {
        "id": "prod-4",
        "name": "Kopi Arabika 250g",
        "category": "Minuman",
        "unit": "pak",
        "current_stock": 38,
        "minimum_stock": 18,
        "average_daily_sales": 2.1,
        "unit_cost": 48_000,
        "trend": 15,
        "color": "blue",
    },
]

suppliers = [
    {"id": "sup-1", "name": "Sumber Makmur", "category": "Bahan pokok", "distance_km": 2.1, "rating": 4.8, "delivery": "Hari ini", "products": ["Minyak Goreng 2L", "Gula Pasir 1kg"], "price": 30500},
    {"id": "sup-2", "name": "Pasar Grosir Jaya", "category": "Bahan pokok", "distance_km": 4.7, "rating": 4.5, "delivery": "Besok", "products": ["Beras Premium 5kg", "Minyak Goreng 2L"], "price": 29800},
    {"id": "sup-3", "name": "Kopi Kita Supply", "category": "Minuman", "distance_km": 3.4, "rating": 4.9, "delivery": "Hari ini", "products": ["Kopi Arabika 250g"], "price": 45500},
]

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
    return {**product, "days_until_stockout": days_until_stockout(product), "status": product_status(product)}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/products")
def list_products() -> list[dict]:
    return [build_product(product) for product in products]


@app.post("/api/products", status_code=201)
def create_product(payload: ProductCreate) -> dict:
    product = {"id": f"prod-{len(products) + 1}", **payload.model_dump(), "average_daily_sales": 0, "trend": 0, "color": "blue"}
    products.append(product)
    return build_product(product)


@app.post("/api/inventory/transactions", status_code=201)
def create_transaction(payload: TransactionCreate) -> dict:
    product = next((item for item in products if item["id"] == payload.product_id), None)
    if product is None:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
    if payload.type == "sale" and product["current_stock"] < payload.quantity:
        raise HTTPException(status_code=400, detail="Stok tidak mencukupi")
    product["current_stock"] += payload.quantity if payload.type == "purchase" else -payload.quantity
    return build_product(product)


@app.get("/api/dashboard")
def dashboard() -> dict:
    enriched = [build_product(product) for product in products]
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
    if category is None:
        return suppliers
    return [supplier for supplier in suppliers if supplier["category"] == category]
