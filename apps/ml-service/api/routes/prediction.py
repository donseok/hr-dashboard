from fastapi import APIRouter

from core.exceptions import EmployeeNotFoundError, PredictionError
from core.logging import get_logger
from feature_store.store import get_employee_features
from models.attrition.model import AttritionModel
from models.recruitment.model import RecruitmentModel
from models.sentiment.model import SentimentModel
from schemas.prediction import (
    AttritionPredictionRequest,
    AttritionBatchRequest,
    AttritionBatchResponse,
    AttritionResult,
    RecruitmentPredictionRequest,
    RecruitmentResult,
    SentimentRequest,
    SentimentResult,
)

logger = get_logger(__name__)
router = APIRouter(prefix="/predict", tags=["Predictions"])

# Models (singleton instances)
_attrition_model = AttritionModel()
_recruitment_model = RecruitmentModel()
_sentiment_model = SentimentModel()


@router.post("/attrition", response_model=AttritionResult)
async def predict_attrition(request: AttritionPredictionRequest):
    """Predict attrition risk for a single employee."""
    try:
        features = await get_employee_features(request.employee_id)
    except RuntimeError:
        # Database not available — use default features for demo
        features = _generate_demo_features(request.employee_id)

    if not features:
        raise EmployeeNotFoundError(request.employee_id)

    try:
        result = _attrition_model.predict(features)
        logger.info(
            f"Attrition prediction: employee={request.employee_id} "
            f"risk={result.risk_score:.4f} level={result.risk_level}"
        )
        return result
    except Exception as e:
        raise PredictionError(str(e))


@router.post("/attrition/batch", response_model=AttritionBatchResponse)
async def predict_attrition_batch(request: AttritionBatchRequest):
    """Predict attrition risk for multiple employees."""
    predictions: list[AttritionResult] = []

    for emp_id in request.employee_ids:
        try:
            features = await get_employee_features(emp_id)
        except RuntimeError:
            features = _generate_demo_features(emp_id)

        if not features:
            continue

        try:
            result = _attrition_model.predict(features)
            predictions.append(result)
        except Exception as e:
            logger.error(f"Failed to predict for {emp_id}: {e}")

    high_risk = [p for p in predictions if p.risk_level in ("HIGH", "CRITICAL")]
    avg_score = sum(p.risk_score for p in predictions) / len(predictions) if predictions else 0

    return AttritionBatchResponse(
        predictions=predictions,
        total=len(predictions),
        high_risk_count=len(high_risk),
        avg_risk_score=round(avg_score, 4),
    )


@router.post("/recruitment", response_model=RecruitmentResult)
async def predict_recruitment(request: RecruitmentPredictionRequest):
    """Predict candidate fit score."""
    try:
        result = _recruitment_model.predict(request.features, request.candidate_id)
        logger.info(
            f"Recruitment prediction: candidate={request.candidate_id} "
            f"fit={result.fit_score:.4f} level={result.fit_level}"
        )
        return result
    except Exception as e:
        raise PredictionError(str(e))


@router.post("/sentiment", response_model=SentimentResult)
async def predict_sentiment(request: SentimentRequest):
    """Analyze text sentiment."""
    try:
        result = _sentiment_model.predict(request.text, request.language)
        logger.info(
            f"Sentiment analysis: sentiment={result.sentiment} "
            f"score={result.score:.4f} lang={request.language}"
        )
        return result
    except Exception as e:
        raise PredictionError(str(e))


def _generate_demo_features(employee_id: str) -> dict:
    """Generate demo features when DB is not available."""
    import hashlib
    seed = int(hashlib.md5(employee_id.encode()).hexdigest()[:8], 16) % 1000
    rng_val = seed / 1000.0

    return {
        "employee_id": employee_id,
        "tenure_months": 12 + rng_val * 48,
        "salary": 60000 + rng_val * 100000,
        "salary_percentile": 0.3 + rng_val * 0.5,
        "grade_level": int(2 + rng_val * 6),
        "department_turnover_rate": 0.05 + rng_val * 0.15,
        "performance_rating": 2.5 + rng_val * 2,
        "performance_trend": (rng_val - 0.5) * 1.5,
        "training_hours_ytd": rng_val * 50,
        "training_completion_rate": 0.3 + rng_val * 0.6,
        "engagement_score": 2.5 + rng_val * 2,
        "manager_tenure_months": 6 + rng_val * 30,
        "manager_changed_recently": rng_val < 0.15,
        "promotion_years_since": 0.5 + rng_val * 4,
        "direct_reports_count": int(rng_val * 8),
        "is_remote": rng_val < 0.2,
        "age_group": int(2 + rng_val * 3),
        "employment_type_full_time": rng_val > 0.1,
        "department_size": int(5 + rng_val * 20),
    }
