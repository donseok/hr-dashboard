import time
from fastapi import APIRouter
from schemas.model_info import HealthResponse

router = APIRouter(tags=["Health"])

_start_time = time.time()


def get_model_registry():
    """Lazy import to avoid circular imports."""
    from main import model_registry
    return model_registry


@router.get("/health", response_model=HealthResponse)
async def health_check():
    registry = get_model_registry()
    models_status = {}
    for name, model in registry.items():
        models_status[name] = "loaded" if model.is_loaded else "not_loaded"

    all_loaded = all(s == "loaded" for s in models_status.values())

    return HealthResponse(
        status="healthy" if all_loaded else "degraded",
        version="0.1.0",
        models=models_status,
        uptime_seconds=round(time.time() - _start_time, 2),
    )


@router.get("/ready")
async def readiness_check():
    registry = get_model_registry()
    all_loaded = all(m.is_loaded for m in registry.values())
    if not all_loaded:
        return {"ready": False, "message": "Some models not loaded"}
    return {"ready": True}
