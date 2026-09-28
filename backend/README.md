# StokWise API

## Menjalankan lokal

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API demo saat ini memakai data in-memory agar alur hackathon dapat diuji tanpa kredensial. Tahap berikutnya adalah mengganti repository in-memory dengan Supabase PostgreSQL dan menambahkan autentikasi.
