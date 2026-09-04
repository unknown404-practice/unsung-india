# Production Deployment Guide: Unsung Heroes of India

This guide provides complete instructions to deploy the **Unsung Heroes of India** Digital Public Infrastructure platform across cloud providers or self-hosted servers.

---

## 🚀 Option 1: 1-Click Vercel Deployment (Recommended for Frontend)

The Next.js 14 App Router frontend is 100% self-contained with built-in API routes (`/api/tts`, `/api/qwen/search`, `/api/submissions`, `/api/image-proxy`) and persistent local storage.

### Steps:
1. Push your repository to **GitHub / GitLab**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and set the **Root Directory** to `frontend`.
4. Leave framework preset as **Next.js**.
5. Set Environment Variables:
   ```env
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```
6. Click **Deploy**. Your app will be live with high-speed Mumbai/Singapore CDN nodes (`bom1`, `sin1`).

---

## 🐳 Option 2: 1-Command Self-Hosted Docker Compose (Sovereign Linux VPS)

Ideal for deploying on AWS EC2, DigitalOcean, Hetzner, or Indian sovereign cloud data centers.

### Prerequisites:
- Ubuntu 22.04 / 24.04 LTS or any Linux server with Docker & Docker Compose installed.

### Steps:
1. Clone the repository on your server:
   ```bash
   git clone https://github.com/your-username/unsung-heroes-india.git
   cd unsung-heroes-india
   ```

2. Create production environment configuration:
   ```bash
   cp .env.example .env.production
   ```

3. Build and launch all containers in the background:
   ```bash
   docker compose up -d --build
   ```

4. Verify services are running:
   ```bash
   docker compose ps
   ```
   * Frontend: `http://<your-server-ip>:3000`
   * Backend API: `http://<your-server-ip>:8000/docs`
   * PostgreSQL: `localhost:5432`

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

## ☁️ Option 3: Full Stack Managed Cloud (Render / Railway)

### Using Render Blueprint:
1. Connect your repository to [Render.com](https://render.com).
2. Click **"New +"** $\rightarrow$ **"Blueprint"**.
3. Select `backend/render.yaml` to deploy:
   - Managed PostgreSQL database.
   - FastAPI backend container with automatic SSL and health checks.
4. Deploy the frontend as a Next.js Web Service with `Root Directory: frontend`.

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
