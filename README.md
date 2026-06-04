# Lehmer Web

Aplikacja do zadań z Podstaw Symulacji Komputerowej.

Projekt jest podzielony na dwie części:

- `backend` - API w Pythonie z obliczeniami numerycznymi.
- `frontend` - interfejs React/Vite, który tylko prezentuje dane i odpytuje backend.

## Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Domyślny adres backendu:

```text
http://127.0.0.1:8000
```

Najważniejsze endpointy:

- `POST /api/lehmer`
- `POST /api/von-neumann`
- `POST /api/integral`
- `POST /api/poisson`
- `POST /api/inverse-cdf/exponential`
- `GET /api/lista0/zadanie9`

## Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Domyślny adres frontendu:

```text
http://127.0.0.1:5173
```

Jeśli backend działa pod innym adresem, ustaw zmienną:

```powershell
$env:VITE_API_URL = "http://127.0.0.1:8000"
npm.cmd run dev
```
