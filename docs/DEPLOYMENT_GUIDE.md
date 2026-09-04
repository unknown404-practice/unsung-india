# Production Deployment Guide: Unsung Heroes of India

This guide provides complete instructions to deploy the **Unsung Heroes of India** Digital Public Infrastructure platform across cloud providers or self-hosted servers.

---

## 🐳 1-Command Sovereign Docker Deployment (with Containerized Local Qwen 2.5)

The entire platform is 100% sovereign, offline-capable, and self-hosted with containerized local Qwen AI models and PostgreSQL.

### Architecture in Docker:
- **`ollama`**: Containerized Ollama instance running Qwen 2.5 (`qwen2.5:7b` or `qwen2.5:14b`).
- **`ollama-pull`**: Auto-provisions and pulls the Qwen 2.5 model on first boot.
- **`postgres`**: PostgreSQL 16 database with health check.
- **`backend`**: FastAPI asynchronous ingestion and API service.
- **`frontend`**: Next.js 14 standalone container connected to `ollama` and `backend`.

### Prerequisites:
- Ubuntu 22.04 / 24.04 LTS or any OS with Docker & Docker Compose installed.

### Steps:
1. Clone the repository on your server:
   ```bash
   git clone https://github.com/your-username/unsung-heroes-india.git
   cd unsung-heroes-india
   ```

2. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

3. Build and launch all containers in the background:
   ```bash
   docker compose up -d --build
   ```

4. Verify all services and the local Qwen container:
   ```bash
   docker compose ps
   ```
   * Frontend: `http://<your-server-ip>:3000`
   * Backend API: `http://<your-server-ip>:8001/docs`
   * Ollama Local AI: `http://<your-server-ip>:11435`
   * PostgreSQL: `localhost:5433`

5. (Optional) Set up Nginx Reverse Proxy with SSL (Certbot):
   ```nginx
   server {
       server_name unsungheroes.in www.unsungheroes.in;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## ⚙️ Environment Variables Reference

| Variable Name | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | Set to `production` in live environments |
| `NEXT_PUBLIC_API_BASE_URL` | Optional | Custom backend API base URL (defaults to Next.js API routes) |
| `DATABASE_URL` | Optional | Async PostgreSQL connection string (`postgresql+asyncpg://...`) |
| `JWT_SECRET_KEY` | Optional | Secret key for admin authentication |
| `ALLOWED_ORIGINS` | Optional | Array of allowed CORS domains for API access |

---

## 🛡️ Health Check Endpoints
- Frontend Health: `GET /api/submissions` $\rightarrow$ `200 OK`
- Image Proxy Stream: `GET /api/image-proxy?url=...` $\rightarrow$ `200 OK`
- TTS Narration: `POST /api/tts` $\rightarrow$ `200 OK`
