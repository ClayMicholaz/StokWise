# StokWise

StokWise membantu UMKM mencegah stockout melalui monitoring inventaris, prediksi kebutuhan, insight AI, dan pencarian supplier lokal.

## Struktur

- `frontend/`: Next.js dashboard
- `backend/`: FastAPI API demo

## Menjalankan

Frontend:

```powershell
cd frontend
npm run dev
```

Backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
