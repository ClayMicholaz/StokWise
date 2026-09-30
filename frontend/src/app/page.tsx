"use client";

<<<<<<< HEAD
import { useMemo, useState } from "react";
=======
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
>>>>>>> origin/master

type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  average_daily_sales: number;
  unit_cost: number;
  trend: number;
  days_until_stockout: number | null;
  status: "critical" | "warning" | "healthy";
  color: string;
};

<<<<<<< HEAD
const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Minyak Goreng 2L",
    category: "Bahan pokok",
    unit: "botol",
    current_stock: 20,
    minimum_stock: 30,
    average_daily_sales: 8,
    unit_cost: 31500,
    trend: 30,
    days_until_stockout: 2.5,
    status: "critical",
    color: "yellow",
  },
  {
    id: "prod-2",
    name: "Beras Premium 5kg",
    category: "Bahan pokok",
    unit: "karung",
    current_stock: 64,
    minimum_stock: 25,
    average_daily_sales: 5.2,
    unit_cost: 76000,
    trend: 8,
    days_until_stockout: 12.3,
    status: "healthy",
    color: "green",
  },
  {
    id: "prod-3",
    name: "Gula Pasir 1kg",
    category: "Bahan pokok",
    unit: "pak",
    current_stock: 12,
    minimum_stock: 20,
    average_daily_sales: 4,
    unit_cost: 17500,
    trend: -4,
    days_until_stockout: 3,
    status: "critical",
    color: "red",
  },
  {
    id: "prod-4",
    name: "Kopi Arabika 250g",
    category: "Minuman",
    unit: "pak",
    current_stock: 38,
    minimum_stock: 18,
    average_daily_sales: 2.1,
    unit_cost: 48000,
    trend: 15,
    days_until_stockout: 18.1,
    status: "healthy",
    color: "blue",
  },
];
const suppliers = [
  {
    name: "Sumber Makmur",
    distance: "2,1 km",
    price: "Rp30.500",
    rating: "4,8",
    delivery: "Hari ini",
  },
  {
    name: "Pasar Grosir Jaya",
    distance: "4,7 km",
    price: "Rp29.800",
    rating: "4,5",
    delivery: "Besok",
  },
  {
    name: "Kopi Kita Supply",
    distance: "3,4 km",
    price: "Rp45.500",
    rating: "4,9",
    delivery: "Hari ini",
  },
];
const rupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

export default function Home() {
  const [products, setProducts] = useState(initialProducts);
  const [activeView, setActiveView] = useState("Ringkasan");
  const [toast, setToast] = useState("");
=======
type Supplier = {
  id: string;
  name: string;
  category?: string;
  distance_km: number;
  price?: number;
  rating: number;
  delivery: string;
};

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");
const rupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;
const settingsEvent = "stokwise-settings-updated";
const subscribeSettings = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(settingsEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(settingsEvent, callback);
  };
};
const viewByPath: Record<string, string> = {
  "/": "Ringkasan",
  "/inventaris": "Inventaris",
  "/supplier-lokal": "Supplier lokal",
  "/keuangan": "Keuangan",
  "/pengaturan": "Pengaturan",
};

export default function Home() {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const activeView = viewByPath[pathname] ?? "Ringkasan";
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [transactionProductId, setTransactionProductId] = useState("");
  const [transactionType, setTransactionType] = useState<"sale" | "purchase">("sale");
  const [toast, setToast] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [supplierQuery, setSupplierQuery] = useState("");
  const [supplierCategory, setSupplierCategory] = useState("Semua kategori");
  const [inventoryQuery, setInventoryQuery] = useState("");
  const [inventoryStatus, setInventoryStatus] = useState("Semua status");
  const businessName = useSyncExternalStore(
    subscribeSettings,
    () => localStorage.getItem("stokwise.businessName") ?? "Nusa Aroma",
    () => "Nusa Aroma",
  );
  const ownerName = useSyncExternalStore(
    subscribeSettings,
    () => localStorage.getItem("stokwise.ownerName") ?? "Nadia A.",
    () => "Nadia A.",
  );
  const restockAlerts = useSyncExternalStore(
    subscribeSettings,
    () => localStorage.getItem("stokwise.restockAlerts") !== "false",
    () => true,
  );
>>>>>>> origin/master
  const criticalCount = products.filter(
    (product) => product.status === "critical",
  ).length;
  const inventoryValue = products.reduce(
    (total, product) => total + product.current_stock * product.unit_cost,
    0,
  );
  const restockItems = useMemo(
    () => products.filter((product) => product.status !== "healthy"),
    [products],
  );
<<<<<<< HEAD

  function recordSale(productId: string) {
    setProducts((items) =>
      items.map((product) => {
        if (product.id !== productId || product.current_stock === 0)
          return product;
        const stock = product.current_stock - 1;
        const days = product.average_daily_sales
          ? Number((stock / product.average_daily_sales).toFixed(1))
          : null;
        return {
          ...product,
          current_stock: stock,
          days_until_stockout: days,
          status:
            days !== null && days <= 3
              ? "critical"
              : stock <= product.minimum_stock
                ? "warning"
                : "healthy",
        };
      }),
    );
    setToast("Penjualan dicatat. Status stok diperbarui.");
=======
  const filteredProducts = useMemo(() => {
    const query = inventoryQuery.trim().toLocaleLowerCase("id-ID");
    return products.filter((product) => {
      const matchesQuery = `${product.name} ${product.category}`
        .toLocaleLowerCase("id-ID")
        .includes(query);
      return matchesQuery && (inventoryStatus === "Semua status" || product.status === inventoryStatus);
    });
  }, [inventoryQuery, inventoryStatus, products]);
  const supplierCategories = useMemo(
    () => [...new Set(suppliers.map((supplier) => supplier.category).filter(Boolean))] as string[],
    [suppliers],
  );
  const filteredSuppliers = useMemo(() => {
    const query = supplierQuery.trim().toLocaleLowerCase("id-ID");
    return suppliers.filter((supplier) => {
      const matchesQuery = supplier.name.toLocaleLowerCase("id-ID").includes(query);
      return matchesQuery && (supplierCategory === "Semua kategori" || supplier.category === supplierCategory);
    });
  }, [supplierCategory, supplierQuery, suppliers]);
  const categoryValues = useMemo(() => {
    const values = new Map<string, number>();
    products.forEach((product) => {
      values.set(product.category, (values.get(product.category) ?? 0) + product.current_stock * product.unit_cost);
    });
    return [...values.entries()].sort((first, second) => second[1] - first[1]);
  }, [products]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [productsResponse, suppliersResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/api/products`, { cache: "no-store" }),
          fetch(`${apiBaseUrl}/api/suppliers`, { cache: "no-store" }),
        ]);
        if (!productsResponse.ok || !suppliersResponse.ok) {
          throw new Error("Tidak dapat mengambil data dari server.");
        }
        const [nextProducts, nextSuppliers] = await Promise.all([
          productsResponse.json() as Promise<Product[]>,
          suppliersResponse.json() as Promise<Supplier[]>,
        ]);
        if (active) {
          setProducts(nextProducts);
          setSuppliers(nextSuppliers);
          setApiError("");
        }
      } catch {
        if (active) setApiError("Data gagal dimuat. Pastikan backend aktif.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadData();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  async function submitTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const productId = String(formData.get("product_id") ?? "");
    const quantity = Number(formData.get("quantity"));
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/inventory/transactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId, type: transactionType, quantity }),
        },
      );
      if (!response.ok) {
        const result = (await response.json()) as { detail?: string };
        throw new Error(result.detail ?? "Transaksi gagal disimpan.");
      }

      const updatedProduct = (await response.json()) as Product;
      setProducts((items) =>
        items.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product,
        ),
      );
      setTransactionOpen(false);
      setApiError("");
      setToast(transactionType === "sale" ? "Penjualan berhasil dicatat." : "Stok masuk berhasil dicatat.");
      window.setTimeout(() => setToast(""), 2600);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Transaksi gagal disimpan.");
    }
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "Lainnya").trim() || "Lainnya",
      unit: String(formData.get("unit") ?? "unit").trim() || "unit",
      current_stock: Number(formData.get("current_stock")),
      minimum_stock: Number(formData.get("minimum_stock")),
      unit_cost: Number(formData.get("unit_cost")),
    };
    try {
      const response = await fetch(`${apiBaseUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const result = (await response.json()) as { detail?: string };
        throw new Error(result.detail ?? "Produk gagal disimpan.");
      }
      const product = (await response.json()) as Product;
      setProducts((items) => [...items, product].sort((a, b) => a.name.localeCompare(b.name, "id")));
      form.reset();
      setApiError("");
      setToast("Produk berhasil ditambahkan.");
      window.setTimeout(() => setToast(""), 2600);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Produk gagal disimpan.");
    }
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    localStorage.setItem("stokwise.businessName", String(formData.get("business_name") ?? "").trim());
    localStorage.setItem("stokwise.ownerName", String(formData.get("owner_name") ?? "").trim());
    localStorage.setItem("stokwise.restockAlerts", String(formData.get("restock_alerts") === "on"));
    window.dispatchEvent(new Event(settingsEvent));
    setToast("Pengaturan berhasil disimpan di perangkat ini.");
>>>>>>> origin/master
    window.setTimeout(() => setToast(""), 2600);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">S</span>
          <span>
            stok<span className="brand-accent">wise</span>
          </span>
        </div>
        <div className="workspace-switcher">
          <span className="avatar">NA</span>
          <span>
<<<<<<< HEAD
            <strong>Nusa Aroma</strong>
            <small>Warung & Kedai</small>
          </span>
          <span className="chevron">⌄</span>
        </div>
        <nav className="nav-list" aria-label="Navigasi utama">
          {["Ringkasan", "Inventaris", "Supplier lokal", "Keuangan"].map(
            (item, index) => (
              <button
                key={item}
                className={`nav-item ${activeView === item ? "active" : ""}`}
                onClick={() => setActiveView(item)}
              >
                <span className="nav-icon">{["▦", "▤", "⌖", "◌"][index]}</span>
=======
            <strong>{businessName}</strong>
            <small>Warung & Kedai</small>
          </span>
        </div>
        <nav className="nav-list" aria-label="Navigasi utama">
          {[
            { label: "Ringkasan", href: "/", icon: "▦" },
            { label: "Inventaris", href: "/inventaris", icon: "▤" },
            { label: "Supplier lokal", href: "/supplier-lokal", icon: "⌖" },
            { label: "Keuangan", href: "/keuangan", icon: "◌" },
          ].map(({ label: item, href, icon }) => (
              <Link
                key={item}
                href={href}
                className={`nav-item ${activeView === item ? "active" : ""}`}
              >
                <span className="nav-icon">{icon}</span>
>>>>>>> origin/master
                {item}
                {item === "Inventaris" && criticalCount > 0 && (
                  <span className="nav-badge">{criticalCount}</span>
                )}
<<<<<<< HEAD
              </button>
            ),
          )}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item">
            <span className="nav-icon">⚙</span>Pengaturan
          </button>
          <div className="help-box">
            <span className="help-icon">?</span>
            <div>
              <strong>Butuh bantuan?</strong>
              <small>Pelajari cara kerja StokWise</small>
            </div>
          </div>
          <div className="profile">
            <span className="avatar avatar-small">NA</span>
            <span>
              <strong>Nadia A.</strong>
              <small>Pemilik usaha</small>
            </span>
            <span className="more">•••</span>
=======
              </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/pengaturan" className={`nav-item ${activeView === "Pengaturan" ? "active" : ""}`}>
            <span className="nav-icon">⚙</span>Pengaturan
          </Link>
          <Link href="/pengaturan" className="help-box">
            <span className="help-icon">?</span>
            <div>
              <strong>Preferensi usaha</strong>
              <small>Kelola profil dan pengingat</small>
            </div>
          </Link>
          <div className="profile">
            <span className="avatar avatar-small">NA</span>
            <span>
              <strong>{ownerName}</strong>
              <small>Pemilik usaha</small>
            </span>
>>>>>>> origin/master
          </div>
        </div>
      </aside>
      <section className="content-area">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark">S</span> stok
            <span className="brand-accent">wise</span>
          </div>
          <div className="topbar-actions">
<<<<<<< HEAD
            <button className="icon-button" aria-label="Bantuan">
              ?
            </button>
            <button className="notification-button" aria-label="Notifikasi">
              ♧<i />
            </button>
            <span className="topbar-date">Senin, 12 Agustus 2024</span>
          </div>
        </header>
        <div className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">RINGKASAN USAHA</p>
              <h1>{activeView}</h1>
              <p className="heading-copy">
                Pantau stok dan buat keputusan belanja dengan lebih percaya
                diri.
=======
            <button className="icon-button" aria-label="Muat ulang data" title="Muat ulang data" onClick={() => setRefreshKey((key) => key + 1)}>
              ↻
            </button>
            <span className="topbar-date">
              {new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </span>
          </div>
        </header>
        <nav className="mobile-nav" aria-label="Navigasi utama">
          {[
            { label: "Ringkasan", href: "/" },
            { label: "Inventaris", href: "/inventaris" },
            { label: "Supplier", href: "/supplier-lokal" },
            { label: "Keuangan", href: "/keuangan" },
            { label: "Pengaturan", href: "/pengaturan" },
          ].map(({ label, href }) => (
            <Link className={activeView === label || (label === "Supplier" && activeView === "Supplier lokal") ? "active" : ""} href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">STOKWISE / {activeView.toLocaleUpperCase("id-ID")}</p>
              <h1>{activeView}</h1>
              <p className="heading-copy">
                {activeView === "Ringkasan" && "Pantau kondisi stok dan nilai usaha dari satu tempat."}
                {activeView === "Inventaris" && "Kelola produk, batas stok, dan setiap pergerakan barang."}
                {activeView === "Supplier lokal" && "Temukan mitra pengadaan berdasarkan kategori dan jarak."}
                {activeView === "Keuangan" && "Pahami nilai modal yang tersimpan dalam persediaan."}
                {activeView === "Pengaturan" && "Atur identitas usaha dan preferensi pemberitahuan."}
>>>>>>> origin/master
              </p>
            </div>
            <button
              className="primary-button"
<<<<<<< HEAD
              onClick={() => recordSale("prod-1")}
=======
              disabled={products.length === 0}
              onClick={() => {
                setTransactionProductId(products[0]?.id ?? "");
                setTransactionOpen(true);
              }}
>>>>>>> origin/master
            >
              <span>＋</span> Catat transaksi
            </button>
          </div>
<<<<<<< HEAD
          {activeView !== "Ringkasan" && (
            <div className="view-notice">
              <span>◌</span> Tampilan <strong>{activeView}</strong> siap
              digunakan. Pilih transaksi dari kartu stok untuk memperbarui data.
            </div>
          )}
=======
          {apiError && (
            <div className="view-notice" role="alert">
              {apiError} <button onClick={() => setRefreshKey((key) => key + 1)}>Coba lagi</button>
            </div>
          )}
          {activeView === "Ringkasan" && <>
>>>>>>> origin/master
          <div className="stats-grid">
            <StatCard
              label="Nilai persediaan"
              value={rupiah(inventoryValue)}
<<<<<<< HEAD
              note="↑ 12,4%"
              noteClass="up"
              detail="dibanding bulan lalu"
=======
              note=""
              detail="harga modal dari stok saat ini"
>>>>>>> origin/master
            />
            <StatCard
              label="Produk dipantau"
              value={products.length.toString()}
              note=""
<<<<<<< HEAD
              detail="4 kategori aktif"
=======
              detail={`${new Set(products.map((product) => product.category)).size} kategori aktif`}
>>>>>>> origin/master
            />
            <StatCard
              label="Perlu perhatian"
              value={criticalCount.toString().padStart(2, "0")}
              note={criticalCount > 0 ? "Segera restock" : "Semua aman"}
              noteClass="alert"
<<<<<<< HEAD
              detail="diprediksi habis ≤ 3 hari"
            />
            <StatCard
              label="Belanja bulan ini"
              value="Rp8,42 jt"
              note="↓ 6,8%"
              noteClass="down"
              detail="dibanding bulan lalu"
=======
              detail={`${restockItems.length} produk di bawah batas stok`}
            />
            <StatCard
              label="Supplier lokal"
              value={suppliers.length.toString()}
              note=""
              detail={`${supplierCategories.length} kategori tersedia`}
>>>>>>> origin/master
            />
          </div>
          <div className="main-grid">
            <section className="panel inventory-panel">
              <PanelHeading
                title="Status inventaris"
                subtitle="Perubahan stok dan prediksi kebutuhan"
                action="Lihat semua"
<<<<<<< HEAD
              />
              <div className="inventory-list">
=======
                href="/inventaris"
              />
              <div className="inventory-list">
                {isLoading && products.length === 0 && (
                  <p role="status">Memuat data inventaris...</p>
                )}
                {!isLoading && products.length === 0 && !apiError && (
                  <p role="status">Belum ada produk dari backend.</p>
                )}
>>>>>>> origin/master
                {products.map((product) => (
                  <div className="inventory-row" key={product.id}>
                    <span className={`product-dot ${product.color}`} />
                    <div className="product-details">
                      <strong>{product.name}</strong>
                      <span>{product.category}</span>
                    </div>
                    <div className="stock-meter">
                      <div className="meter-label">
                        <span>
                          <b>{product.current_stock}</b> {product.unit}
                        </span>
                        <span
                          className={
                            product.status === "critical"
                              ? "critical-text"
                              : "healthy-text"
                          }
                        >
                          {product.days_until_stockout !== null
                            ? `${product.days_until_stockout} hari`
                            : "-"}
                        </span>
                      </div>
                      <div className="meter">
                        <i
                          className={product.status}
                          style={{
<<<<<<< HEAD
                            width: `${Math.min((product.current_stock / (product.minimum_stock * 2)) * 100, 100)}%`,
=======
                            width: `${Math.min((product.current_stock / Math.max(product.minimum_stock * 2, 1)) * 100, 100)}%`,
>>>>>>> origin/master
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`trend ${product.trend >= 0 ? "positive" : "negative"}`}
                    >
                      {product.trend >= 0 ? "↗" : "↘"} {Math.abs(product.trend)}
                      %
                    </div>
                    <button
                      className="row-action"
<<<<<<< HEAD
                      title="Catat satu penjualan"
                      onClick={() => recordSale(product.id)}
                    >
                      •••
=======
                      title={`Catat transaksi ${product.name}`}
                      aria-label={`Catat transaksi ${product.name}`}
                      onClick={() => {
                        setTransactionProductId(product.id);
                        setTransactionOpen(true);
                      }}
                    >
                      ＋
>>>>>>> origin/master
                    </button>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel insight-panel">
<<<<<<< HEAD
              <div className="insight-top">
                <span className="spark">✦</span>
                <span>INSIGHT DARI ASISTEN AI</span>
                <span className="insight-time">Baru saja</span>
              </div>
              <h2>
                Permintaan minyak goreng naik <em>30%</em> minggu ini
              </h2>
              <p>
                Stok diperkirakan habis dalam <strong>2,5 hari</strong>.
                Pertimbangkan restock 48 botol untuk menjaga persediaan selama
                satu minggu ke depan.
              </p>
              <div className="insight-divider" />
              <div className="insight-footer">
                <span className="mini-product">MG</span>
                <span>Minyak Goreng 2L</span>
                <button className="text-button">Lihat analisis →</button>
=======
              <div className="insight-top"><span className="spark">✦</span><span>PEMANTAUAN STOK</span></div>
              <h2>{restockItems[0] ? `${restockItems[0].name} perlu diperiksa` : "Persediaan dalam kondisi baik"}</h2>
              <p>{restockItems[0] ? <>Tersisa <strong>{restockItems[0].current_stock} {restockItems[0].unit}</strong>. {restockItems[0].days_until_stockout === null ? "Stok sudah menyentuh batas minimum." : `Dengan laju penjualan saat ini, stok cukup sekitar ${restockItems[0].days_until_stockout} hari.`}</> : "Belum ada produk yang berada di bawah batas minimum atau prediksi aman."}</p>
              <div className="insight-divider" />
              <div className="insight-footer">
                <span className="mini-product">{restockItems[0]?.name.slice(0, 2).toUpperCase() ?? "OK"}</span>
                <span>{restockItems[0]?.category ?? "Semua kategori"}</span>
                <Link href="/inventaris" className="text-button">Lihat stok →</Link>
>>>>>>> origin/master
              </div>
            </section>
          </div>
          <div className="bottom-grid">
            <section className="panel chart-panel">
              <PanelHeading
<<<<<<< HEAD
                title="Aktivitas penjualan"
                subtitle="7 hari terakhir"
                action="Minggu ini"
              />
              <div className="chart">
                <div className="chart-y">
                  <span>240</span>
                  <span>180</span>
                  <span>120</span>
                  <span>60</span>
                  <span>0</span>
                </div>
                <div className="chart-area">
                  <div className="grid-lines">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <svg
                    viewBox="0 0 600 180"
                    preserveAspectRatio="none"
                    aria-label="Grafik aktivitas penjualan"
                  >
                    <defs>
                      <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#c9e9dc" stopOpacity=".8" />
                        <stop offset="1" stopColor="#c9e9dc" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 132 C35 126, 58 100, 98 111 S145 123, 188 84 S240 98, 275 74 S340 92, 380 54 S430 72, 470 48 S540 54, 600 18 L600 180 L0 180Z"
                      fill="url(#area)"
                    />
                    <path
                      d="M0 132 C35 126, 58 100, 98 111 S145 123, 188 84 S240 98, 275 74 S340 92, 380 54 S430 72, 470 48 S540 54, 600 18"
                      fill="none"
                      stroke="#278c68"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="chart-x">
                    <span>Sen</span>
                    <span>Sel</span>
                    <span>Rab</span>
                    <span>Kam</span>
                    <span>Jum</span>
                    <span>Sab</span>
                    <span>Min</span>
                  </div>
                </div>
=======
                title="Nilai stok per kategori"
                subtitle="Dihitung dari jumlah barang × harga modal"
              />
              <div className="category-bars">
                {categoryValues.length === 0 && <p>Tambahkan produk untuk melihat nilai per kategori.</p>}
                {categoryValues.map(([category, value]) => (
                  <div className="category-bar-row" key={category}>
                    <div><span>{category}</span><strong>{rupiah(value)}</strong></div>
                    <div className="meter"><i style={{ width: `${Math.max((value / Math.max(...categoryValues.map(([, total]) => total), 1)) * 100, 3)}%` }} /></div>
                  </div>
                ))}
>>>>>>> origin/master
              </div>
            </section>
            <section className="panel supplier-panel">
              <PanelHeading
                title="Supplier rekomendasi"
                subtitle="Pilihan terdekat untuk restock"
                action="Cari supplier"
<<<<<<< HEAD
              />
              <div className="supplier-list">
=======
                href="/supplier-lokal"
              />
              <div className="supplier-list">
                {suppliers.length === 0 && <p className="empty-state">Belum ada supplier yang dapat ditampilkan.</p>}
>>>>>>> origin/master
                {suppliers.map((supplier) => (
                  <div className="supplier-row" key={supplier.name}>
                    <span className="supplier-avatar">
                      {supplier.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div className="supplier-details">
                      <strong>{supplier.name}</strong>
                      <span>
<<<<<<< HEAD
                        ★ {supplier.rating} · {supplier.distance}
                      </span>
                    </div>
                    <div className="supplier-price">
                      <strong>{supplier.price}</strong>
=======
                        ★ {supplier.rating.toLocaleString("id-ID")} · {supplier.distance_km.toLocaleString("id-ID")} km
                      </span>
                    </div>
                    <div className="supplier-price">
                      <strong>
                        {supplier.price == null
                          ? "Harga belum tersedia"
                          : rupiah(supplier.price)}
                      </strong>
>>>>>>> origin/master
                      <span>{supplier.delivery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
<<<<<<< HEAD
          <section className="restock-strip">
=======
          {restockAlerts && <section className="restock-strip">
>>>>>>> origin/master
            <div className="restock-icon">↗</div>
            <div>
              <strong>
                {restockItems.length} produk membutuhkan perhatian
              </strong>
              <span>
                Periksa rekomendasi restock agar operasional tetap lancar.
              </span>
            </div>
<<<<<<< HEAD
            <button className="dark-button">Buka daftar restock →</button>
          </section>
=======
            <Link className="dark-button" href="/inventaris">Buka daftar restock →</Link>
          </section>}
          </>}
          {activeView === "Inventaris" && <InventoryPage
            products={filteredProducts}
            query={inventoryQuery}
            status={inventoryStatus}
            onQueryChange={setInventoryQuery}
            onStatusChange={setInventoryStatus}
            onCreateProduct={createProduct}
            onTransaction={(productId) => {
              setTransactionProductId(productId);
              setTransactionOpen(true);
            }}
            isLoading={isLoading}
          />}
          {activeView === "Supplier lokal" && <SupplierPage
            suppliers={filteredSuppliers}
            categories={supplierCategories}
            query={supplierQuery}
            category={supplierCategory}
            onQueryChange={setSupplierQuery}
            onCategoryChange={setSupplierCategory}
            isLoading={isLoading}
          />}
          {activeView === "Keuangan" && <FinancePage
            products={products}
            categoryValues={categoryValues}
            inventoryValue={inventoryValue}
            restockItems={restockItems}
          />}
          {activeView === "Pengaturan" && <SettingsPage
            businessName={businessName}
            ownerName={ownerName}
            restockAlerts={restockAlerts}
            onSave={saveSettings}
          />}
          {transactionOpen && <div className="dialog-backdrop" onKeyDown={(event) => {
            if (event.key === "Escape") setTransactionOpen(false);
          }} onMouseDown={(event) => {
            if (event.target === event.currentTarget) setTransactionOpen(false);
          }}>
            <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="transaction-title">
              <div className="dialog-heading"><div><p className="eyebrow">PERGERAKAN BARANG</p><h2 id="transaction-title">Catat transaksi</h2></div><button className="dialog-close" type="button" aria-label="Tutup" onClick={() => setTransactionOpen(false)}>×</button></div>
              <form className="form-grid" onSubmit={submitTransaction}>
                <label className="field field-wide">Produk<select name="product_id" value={transactionProductId} onChange={(event) => setTransactionProductId(event.target.value)} required>{products.map((product) => <option value={product.id} key={product.id}>{product.name} · {product.current_stock} {product.unit}</option>)}</select></label>
                <fieldset className="field field-wide choice-field"><legend>Jenis transaksi</legend><label><input type="radio" name="type-choice" checked={transactionType === "sale"} onChange={() => setTransactionType("sale")} /> Penjualan / stok keluar</label><label><input type="radio" name="type-choice" checked={transactionType === "purchase"} onChange={() => setTransactionType("purchase")} /> Pembelian / stok masuk</label></fieldset>
                <label className="field field-wide">Jumlah<input name="quantity" type="number" min="1" step="1" defaultValue="1" required /></label>
                <div className="dialog-actions field-wide"><button type="button" className="secondary-button" onClick={() => setTransactionOpen(false)}>Batal</button><button type="submit" className="primary-button">Simpan transaksi</button></div>
              </form>
            </section>
          </div>}
>>>>>>> origin/master
        </div>
      </section>
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}
<<<<<<< HEAD
=======
function InventoryPage({
  products,
  query,
  status,
  onQueryChange,
  onStatusChange,
  onCreateProduct,
  onTransaction,
  isLoading,
}: {
  products: Product[];
  query: string;
  status: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreateProduct: (event: FormEvent<HTMLFormElement>) => void;
  onTransaction: (productId: string) => void;
  isLoading: boolean;
}) {
  return (
    <section className="panel page-panel">
      <div className="section-toolbar">
        <div className="filter-controls">
          <label className="search-field"><span>⌕</span><input aria-label="Cari produk" placeholder="Cari nama atau kategori" value={query} onChange={(event) => onQueryChange(event.target.value)} /></label>
          <select aria-label="Filter status stok" value={status} onChange={(event) => onStatusChange(event.target.value)}>
            <option>Semua status</option><option value="critical">Kritis</option><option value="warning">Rendah</option><option value="healthy">Aman</option>
          </select>
        </div>
        <span className="result-count">{products.length} produk</span>
      </div>
      <details className="add-product">
        <summary className="secondary-button">＋ Tambah produk</summary>
        <form className="form-grid product-form" onSubmit={onCreateProduct}>
          <label className="field">Nama produk<input name="name" minLength={2} required placeholder="Contoh: Kopi Arabika" /></label>
          <label className="field">Kategori<input name="category" required placeholder="Contoh: Minuman" /></label>
          <label className="field">Satuan<input name="unit" required placeholder="pcs, kg, botol" /></label>
          <label className="field">Stok awal<input name="current_stock" type="number" min="0" step="1" defaultValue="0" required /></label>
          <label className="field">Batas minimum<input name="minimum_stock" type="number" min="0" step="1" defaultValue="5" required /></label>
          <label className="field">Harga modal / unit<input name="unit_cost" type="number" min="0" step="1" defaultValue="0" required /></label>
          <button className="primary-button field-wide" type="submit">Simpan produk</button>
        </form>
      </details>
      {isLoading && products.length === 0 ? <p className="empty-state" role="status">Memuat produk...</p> : products.length === 0 ? <p className="empty-state">Tidak ada produk yang cocok. Ubah filter atau tambahkan produk.</p> : (
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Produk</th><th>Stok tersedia</th><th>Batas minimum</th><th>Nilai stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
          {products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.category}</small></td><td>{product.current_stock} {product.unit}</td><td>{product.minimum_stock} {product.unit}</td><td>{rupiah(product.current_stock * product.unit_cost)}</td><td><span className={`status-pill ${product.status}`}>{product.status === "critical" ? "Kritis" : product.status === "warning" ? "Rendah" : "Aman"}</span></td><td><button className="table-action" onClick={() => onTransaction(product.id)}>Catat stok</button></td></tr>)}
        </tbody></table></div>
      )}
    </section>
  );
}

function SupplierPage({
  suppliers,
  categories,
  query,
  category,
  onQueryChange,
  onCategoryChange,
  isLoading,
}: {
  suppliers: Supplier[];
  categories: string[];
  query: string;
  category: string;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  isLoading: boolean;
}) {
  return (
    <section className="panel page-panel">
      <div className="section-toolbar">
        <div className="filter-controls">
          <label className="search-field"><span>⌕</span><input aria-label="Cari supplier" placeholder="Cari nama supplier" value={query} onChange={(event) => onQueryChange(event.target.value)} /></label>
          <select aria-label="Filter kategori supplier" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            <option>Semua kategori</option>{categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <span className="result-count">{suppliers.length} supplier</span>
      </div>
      {isLoading && suppliers.length === 0 ? <p className="empty-state" role="status">Memuat supplier...</p> : suppliers.length === 0 ? <p className="empty-state">Supplier belum tersedia untuk pencarian ini.</p> : (
        <div className="supplier-directory">{suppliers.map((supplier) => <article className="supplier-card" key={supplier.id}>
          <span className="supplier-avatar">{supplier.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span>
          <div className="supplier-card-main"><strong>{supplier.name}</strong><span>{supplier.category || "Kategori umum"}</span></div>
          <div className="supplier-metric"><small>Jarak</small><strong>{supplier.distance_km.toLocaleString("id-ID")} km</strong></div>
          <div className="supplier-metric"><small>Penilaian</small><strong>★ {supplier.rating.toLocaleString("id-ID")}</strong></div>
          <div className="supplier-metric"><small>Harga tercatat</small><strong>{supplier.price == null ? "Belum tersedia" : rupiah(supplier.price)}</strong></div>
          <span className="delivery-chip">{supplier.delivery}</span>
        </article>)}</div>
      )}
    </section>
  );
}

function FinancePage({
  products,
  categoryValues,
  inventoryValue,
  restockItems,
}: {
  products: Product[];
  categoryValues: [string, number][];
  inventoryValue: number;
  restockItems: Product[];
}) {
  return (
    <>
      <div className="stats-grid finance-stats">
        <StatCard label="Nilai modal persediaan" value={rupiah(inventoryValue)} note="" detail="berdasarkan harga modal produk" />
        <StatCard label="Produk dipantau" value={products.length.toLocaleString("id-ID")} note="" detail={`${new Set(products.map((product) => product.category)).size} kategori`} />
        <StatCard label="Nilai stok perlu perhatian" value={rupiah(restockItems.reduce((total, product) => total + product.current_stock * product.unit_cost, 0))} note="" detail={`${restockItems.length} produk di bawah batas`} />
        <StatCard label="Rata-rata modal / produk" value={rupiah(products.length ? inventoryValue / products.length : 0)} note="" detail="nilai persediaan dibagi jumlah produk" />
      </div>
      <section className="panel page-panel">
        <PanelHeading title="Rincian modal per kategori" subtitle="Nilai dihitung dari stok saat ini dan harga modal yang tersimpan." />
        {categoryValues.length === 0 ? <p className="empty-state">Tambahkan produk untuk melihat rincian nilai.</p> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Kategori</th><th>Jumlah produk</th><th>Unit tersedia</th><th>Nilai modal</th><th>Porsi</th></tr></thead><tbody>{categoryValues.map(([category, value]) => {
          const categoryProducts = products.filter((product) => product.category === category);
          const units = categoryProducts.reduce((total, product) => total + product.current_stock, 0);
          return <tr key={category}><td><strong>{category}</strong></td><td>{categoryProducts.length}</td><td>{units.toLocaleString("id-ID")}</td><td>{rupiah(value)}</td><td>{inventoryValue ? `${((value / inventoryValue) * 100).toLocaleString("id-ID", { maximumFractionDigits: 1 })}%` : "0%"}</td></tr>;
        })}</tbody></table></div>}
      </section>
    </>
  );
}

function SettingsPage({
  businessName,
  ownerName,
  restockAlerts,
  onSave,
}: {
  businessName: string;
  ownerName: string;
  restockAlerts: boolean;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="panel page-panel settings-panel">
      <div className="panel-heading"><div><h2>Profil usaha</h2><p>Informasi ini ditampilkan pada workspace di perangkat ini.</p></div></div>
      <form className="settings-form" onSubmit={onSave}>
        <label className="field">Nama usaha<input name="business_name" defaultValue={businessName} minLength={2} required /></label>
        <label className="field">Nama pemilik<input name="owner_name" defaultValue={ownerName} minLength={2} required /></label>
        <label className="toggle-row"><span><strong>Pengingat restock</strong><small>Tampilkan peringatan stok pada ringkasan.</small></span><input name="restock_alerts" type="checkbox" defaultChecked={restockAlerts} /></label>
        <div><button type="submit" className="primary-button">Simpan pengaturan</button></div>
      </form>
      <div className="settings-footnote">Preferensi profil disimpan di browser ini dan tidak dikirim ke backend.</div>
    </section>
  );
}

>>>>>>> origin/master
function PanelHeading({
  title,
  subtitle,
  action,
<<<<<<< HEAD
}: {
  title: string;
  subtitle: string;
  action: string;
=======
  href,
}: {
  title: string;
  subtitle: string;
  action?: string;
  href?: string;
>>>>>>> origin/master
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
<<<<<<< HEAD
      <button className="ghost-button">
        {action} <span>→</span>
      </button>
=======
      {action && (href ? <Link className="ghost-button" href={href}>{action} <span>→</span></Link> : <span className="section-label">{action}</span>)}
>>>>>>> origin/master
    </div>
  );
}
function StatCard({
  label,
  value,
  note,
  noteClass = "",
  detail,
}: {
  label: string;
  value: string;
  note: string;
  noteClass?: string;
  detail: string;
}) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <div className="stat-note">
        <span className={noteClass}>{note}</span>
        <small>{detail}</small>
      </div>
    </div>
  );
}
