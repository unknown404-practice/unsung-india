# Unsung Heroes of India — FastAPI Backend

Core REST API and automated Banner Factory engine for the **Unsung Heroes of India** Digital Public Infrastructure.

---

## 1. Quickstart (Local Development)

### 1.1 Prerequisites
- Python 3.11+
- PostgreSQL 15+ (or Docker)

### 1.2 Setup Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
```

### 1.3 Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` with your local PostgreSQL or Neon serverless connection string.

### 1.4 Seed the Database
Run the seed script from the project root:
```bash
python scripts/seed_heroes.py
```

### 1.5 Run the Backend Server
```bash
cd backend/src
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger UI: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## 2. Running via Docker Compose

To start both PostgreSQL and the FastAPI application locally:
```bash
cd infra
docker-compose -f docker-compose.dev.yml up --build
```
