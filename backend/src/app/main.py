from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import engine, Base
from app.auth.router import router as auth_router
from app.heroes.router import router as heroes_router
from app.banners.router import router as banners_router
from app.submissions.router import router as submissions_router
from app.search.router import router as search_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables if they do not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: Dispose DB connection pool
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Sovereign Digital Public Infrastructure (DPI) documenting India's historical heroes with DuckDuckGo + Wikipedia hybrid search and automated banner generation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Health Check
@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0",
    }


# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(heroes_router, prefix=settings.API_V1_STR)
app.include_router(banners_router, prefix=settings.API_V1_STR)
app.include_router(submissions_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
