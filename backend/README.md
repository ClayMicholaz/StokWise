# StokWise API

## Menjalankan lokal

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API membaca produk dan supplier dari tabel `products` dan `suppliers` di Supabase. Perubahan inventaris disimpan ke `products.current_stock` dan dicatat di `inventory_transactions`.

Pastikan `backend/.env` berisi `SUPABASE_URL` dan `SUPABASE_KEY`. Key hanya digunakan backend dan tidak boleh diberi awalan `NEXT_PUBLIC_` atau dikirim ke browser. Install dependency dengan `pip install -r requirements.txt`, lalu jalankan API dari folder `backend` seperti perintah di atas.
