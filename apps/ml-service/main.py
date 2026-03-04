"""
HR Dashboard ML Service — FastAPI application entry point.

Provides prediction APIs for:
  - Employee attrition risk (XGBoost simulation)
  - Candidate fit scoring (LightGBM simulation)
  - Text sentiment analysis (KoBERT keyword engine)
"""

import time
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import get_settings
from core.database import init_pool, close_pool
from core.exceptions import (
    EmployeeNotFoundError,
    ModelNotFoundError,
    PredictionError,
    FeatureExtractionError,
    InvalidInputError,
)
from core.logging import get_logger
from models.attrition.model import AttritionModel
from models.recruitment.model import RecruitmentModel
from models.sentiment.model import SentimentModel

logger = get_logger(__name__)
settings = get_settings()

# ---------------------------------------------------------------------------
# Model registry — used by /health to report per-model status
# ---------------------------------------------------------------------------
model_registry: dict[str, AttritionModel | RecruitmentModel | SentimentModel] = {}


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("Starting ML service …")

    # Database pool
    try:
        await init_pool()
        logger.info("Database pool initialised")
    except Exception as exc:
        logger.warning(f"Database pool unavailable (demo mode): {exc}")

    # Redis (feature-store cache)
    try:
        from feature_store.store import init_redis
        await init_redis()
        logger.info("Redis cache connected")
    except Exception as exc:
        logger.warning(f"Redis unavailable (cache disabled): {exc}")

    # Pre-load models
    model_registry["attrition"] = AttritionModel()
    model_registry["recruitment"] = RecruitmentModel()
    model_registry["sentiment"] = SentimentModel()
    logger.info(f"Loaded {len(model_registry)} models")

    yield  # ---- app is running ----

    # Shutdown
    logger.info("Shutting down ML service …")
    await close_pool()


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="HR Dashboard ML Service",
    description="Prediction APIs for attrition, recruitment and sentiment analysis",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request metrics middleware
# ---------------------------------------------------------------------------
@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{elapsed:.4f}"
    logger.debug(
        f"{request.method} {request.url.path} → {response.status_code} ({elapsed:.3f}s)"
    )
    return response


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------
@app.exception_handler(EmployeeNotFoundError)
async def employee_not_found_handler(_req: Request, exc: EmployeeNotFoundError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(ModelNotFoundError)
async def model_not_found_handler(_req: Request, exc: ModelNotFoundError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(PredictionError)
async def prediction_error_handler(_req: Request, exc: PredictionError):
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.exception_handler(FeatureExtractionError)
async def feature_extraction_error_handler(_req: Request, exc: FeatureExtractionError):
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.exception_handler(InvalidInputError)
async def invalid_input_handler(_req: Request, exc: InvalidInputError):
    return JSONResponse(status_code=422, content={"detail": str(exc)})


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
from api.routes.health import router as health_router  # noqa: E402
from api.routes.prediction import router as prediction_router  # noqa: E402
from api.routes.model_info import router as model_info_router  # noqa: E402

app.include_router(health_router)
app.include_router(prediction_router, prefix="/api/v1")
app.include_router(model_info_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "service": "HR Dashboard ML Service",
        "version": "0.1.0",
        "docs": "/docs",
    }


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host if hasattr(settings, "host") else "0.0.0.0",
        port=settings.port if hasattr(settings, "port") else 8000,
        reload=True,
        log_level="info",
    )
