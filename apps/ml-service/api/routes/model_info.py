from fastapi import APIRouter
from schemas.model_info import ModelInfo, ModelMetrics
from models.attrition.trainer import AttritionTrainer
from models.recruitment.trainer import RecruitmentTrainer
from models.attrition.config import FEATURE_NAMES as ATTRITION_FEATURES
from models.recruitment.config import FEATURE_NAMES as RECRUITMENT_FEATURES

router = APIRouter(prefix="/models", tags=["Model Info"])


@router.get("/", response_model=list[ModelInfo])
async def list_models():
    attrition_trainer = AttritionTrainer()
    recruitment_trainer = RecruitmentTrainer()

    return [
        ModelInfo(
            name="attrition",
            version="1.0.0",
            model_type="XGBoost Classifier",
            framework="xgboost",
            status="loaded",
            feature_count=len(ATTRITION_FEATURES),
            training_samples=500,
            metrics=ModelMetrics(**attrition_trainer.get_simulated_metrics()),
            description="Employee attrition risk prediction model using 18 features",
        ),
        ModelInfo(
            name="recruitment",
            version="1.0.0",
            model_type="LightGBM Classifier",
            framework="lightgbm",
            status="loaded",
            feature_count=len(RECRUITMENT_FEATURES),
            training_samples=300,
            metrics=ModelMetrics(**recruitment_trainer.get_simulated_metrics()),
            description="Candidate fit prediction model using 12 features",
        ),
        ModelInfo(
            name="sentiment",
            version="1.0.0",
            model_type="Rule-Based (KoBERT Simulation)",
            framework="keyword_engine",
            status="loaded",
            feature_count=0,
            metrics=ModelMetrics(accuracy=0.78, precision=0.75, recall=0.80, f1_score=0.77),
            description="Korean/English sentiment analysis using weighted keyword dictionary",
        ),
    ]


@router.get("/{model_name}", response_model=ModelInfo)
async def get_model_info(model_name: str):
    models = await list_models()
    for model in models:
        if model.name == model_name:
            return model
    from core.exceptions import ModelNotFoundError
    raise ModelNotFoundError(model_name)


@router.get("/{model_name}/feature-importance")
async def get_feature_importance(model_name: str):
    if model_name == "attrition":
        from models.attrition.model import AttritionModel
        model = AttritionModel()
        return model.get_feature_importance()
    elif model_name == "recruitment":
        from models.recruitment.model import RecruitmentModel
        return {k: round(abs(v), 4) for k, v in sorted(
            RecruitmentModel.FEATURE_WEIGHTS.items(), key=lambda x: -abs(x[1])
        )}
    from core.exceptions import ModelNotFoundError
    raise ModelNotFoundError(model_name)
