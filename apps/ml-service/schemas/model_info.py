from pydantic import BaseModel
from datetime import datetime


class ModelMetrics(BaseModel):
    accuracy: float | None = None
    precision: float | None = None
    recall: float | None = None
    f1_score: float | None = None
    auc_roc: float | None = None
    rmse: float | None = None
    mae: float | None = None


class ModelInfo(BaseModel):
    name: str
    version: str
    model_type: str
    framework: str
    status: str  # loaded, not_loaded, error
    feature_count: int
    training_samples: int | None = None
    last_trained: datetime | None = None
    metrics: ModelMetrics
    description: str


class HealthResponse(BaseModel):
    status: str
    version: str
    models: dict[str, str]  # model_name: status
    uptime_seconds: float
