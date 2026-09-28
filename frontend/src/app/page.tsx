"use client";

import { useMemo, useState } from "react";

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
                {item}
                {item === "Inventaris" && criticalCount > 0 && (
                  <span className="nav-badge">{criticalCount}</span>
                )}
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
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => recordSale("prod-1")}
            >
              <span>＋</span> Catat transaksi
            </button>
          </div>
          {activeView !== "Ringkasan" && (
            <div className="view-notice">
              <span>◌</span> Tampilan <strong>{activeView}</strong> siap
              digunakan. Pilih transaksi dari kartu stok untuk memperbarui data.
            </div>
          )}
          <div className="stats-grid">
            <StatCard
              label="Nilai persediaan"
              value={rupiah(inventoryValue)}
              note="↑ 12,4%"
              noteClass="up"
              detail="dibanding bulan lalu"
            />
            <StatCard
              label="Produk dipantau"
              value={products.length.toString()}
              note=""
              detail="4 kategori aktif"
            />
            <StatCard
              label="Perlu perhatian"
              value={criticalCount.toString().padStart(2, "0")}
              note={criticalCount > 0 ? "Segera restock" : "Semua aman"}
              noteClass="alert"
              detail="diprediksi habis ≤ 3 hari"
            />
            <StatCard
              label="Belanja bulan ini"
              value="Rp8,42 jt"
              note="↓ 6,8%"
              noteClass="down"
              detail="dibanding bulan lalu"
            />
          </div>
          <div className="main-grid">
            <section className="panel inventory-panel">
              <PanelHeading
                title="Status inventaris"
                subtitle="Perubahan stok dan prediksi kebutuhan"
                action="Lihat semua"
              />
              <div className="inventory-list">
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
                            width: `${Math.min((product.current_stock / (product.minimum_stock * 2)) * 100, 100)}%`,
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
                      title="Catat satu penjualan"
                      onClick={() => recordSale(product.id)}
                    >
                      •••
                    </button>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel insight-panel">
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
              </div>
            </section>
          </div>
          <div className="bottom-grid">
            <section className="panel chart-panel">
              <PanelHeading
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
              </div>
            </section>
            <section className="panel supplier-panel">
              <PanelHeading
                title="Supplier rekomendasi"
                subtitle="Pilihan terdekat untuk restock"
                action="Cari supplier"
              />
              <div className="supplier-list">
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
                        ★ {supplier.rating} · {supplier.distance}
                      </span>
                    </div>
                    <div className="supplier-price">
                      <strong>{supplier.price}</strong>
                      <span>{supplier.delivery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="restock-strip">
            <div className="restock-icon">↗</div>
            <div>
              <strong>
                {restockItems.length} produk membutuhkan perhatian
              </strong>
              <span>
                Periksa rekomendasi restock agar operasional tetap lancar.
              </span>
            </div>
            <button className="dark-button">Buka daftar restock →</button>
          </section>
        </div>
      </section>
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}
function PanelHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action: string;
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <button className="ghost-button">
        {action} <span>→</span>
      </button>
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
