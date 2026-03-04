import numpy as np
from datetime import datetime, timezone

from core.logging import get_logger
from models.attrition.config import FEATURE_NAMES, FEATURE_DESCRIPTIONS, RISK_THRESHOLDS
from models.attrition.features import extract_feature_vector
from models.attrition.preprocessor import AttritionPreprocessor
from schemas.prediction import AttritionResult, AttritionFactor

logger = get_logger(__name__)


class AttritionModel:
    """
    XGBoost-based attrition prediction model.

    Uses a rule-based simulation that mirrors XGBoost feature importance patterns.
    In production, this would load a trained XGBoost model from disk.
    """

    VERSION = "1.0.0"
    MODEL_TYPE = "xgboost"

    # Simulated feature importance weights (from a trained XGBoost model)
    FEATURE_WEIGHTS = {
        "tenure_months": -0.08,         # longer tenure = lower risk
        "salary": -0.04,                # higher salary = lower risk
        "salary_percentile": -0.12,     # higher percentile = lower risk
        "grade_level": -0.03,           # higher grade = lower risk
        "department_turnover_rate": 0.15, # high dept turnover = higher risk
        "performance_rating": -0.18,    # higher rating = lower risk
        "performance_trend": -0.10,     # improving trend = lower risk
        "training_hours_ytd": -0.06,    # more training = lower risk
        "training_completion_rate": -0.05,
        "engagement_score": -0.20,      # high engagement = lower risk (top factor)
        "manager_tenure_months": -0.04,
        "manager_changed_recently": 0.08, # recent change = higher risk
        "promotion_years_since": 0.14,  # longer wait = higher risk
        "direct_reports_count": -0.03,
        "is_remote": 0.02,
        "age_group": -0.02,
        "employment_type_full_time": -0.05,
        "department_size": -0.01,
    }

    def __init__(self):
        self.preprocessor = AttritionPreprocessor()
        self._is_loaded = True
        logger.info(f"AttritionModel v{self.VERSION} initialized (simulated)")

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    def predict(self, features: dict) -> AttritionResult:
        """Predict attrition risk for an employee."""
        processed = self.preprocessor.preprocess(features)
        feature_vector = extract_feature_vector(processed)

        # Simulated prediction using weighted feature contributions
        risk_score = self._calculate_risk_score(processed)
        risk_level = self._get_risk_level(risk_score)
        top_factors = self._get_top_factors(processed)
        confidence = self._calculate_confidence(processed)

        return AttritionResult(
            employee_id=features.get("employee_id", "unknown"),
            risk_score=round(risk_score, 4),
            risk_level=risk_level,
            top_factors=top_factors,
            confidence=round(confidence, 4),
            predicted_at=datetime.now(timezone.utc),
        )

    def _calculate_risk_score(self, features: dict) -> float:
        """Calculate risk score using simulated XGBoost logic."""
        base_score = 0.3  # base attrition probability

        score = base_score
        for feature_name, weight in self.FEATURE_WEIGHTS.items():
            value = features.get(feature_name, 0)
            mean = self.preprocessor.MEANS.get(feature_name, 0)
            std = self.preprocessor.STDS.get(feature_name, 1)

            if std == 0:
                std = 1

            normalized = (value - mean) / std
            score += weight * normalized * 0.1

        # Apply sigmoid to bound [0, 1]
        score = 1 / (1 + np.exp(-score * 3))

        return float(np.clip(score, 0.01, 0.99))

    def _get_risk_level(self, risk_score: float) -> str:
        for level, threshold in RISK_THRESHOLDS.items():
            if risk_score <= threshold:
                return level
        return "CRITICAL"

    def _get_top_factors(self, features: dict, top_n: int = 5) -> list[AttritionFactor]:
        """Get top contributing factors."""
        contributions = []
        for feature_name, weight in self.FEATURE_WEIGHTS.items():
            value = features.get(feature_name, 0)
            mean = self.preprocessor.MEANS.get(feature_name, 0)
            std = self.preprocessor.STDS.get(feature_name, 1) or 1

            normalized = (value - mean) / std
            contribution = abs(weight * normalized)

            is_risk = (weight > 0 and value > mean) or (weight < 0 and value < mean)
            desc = FEATURE_DESCRIPTIONS.get(feature_name, feature_name)
            if is_risk:
                desc = f"{desc}: below average" if weight < 0 else f"{desc}: above average"
            else:
                desc = f"{desc}: favorable"

            contributions.append(
                AttritionFactor(
                    feature=feature_name,
                    importance=round(contribution, 4),
                    value=round(float(value), 4),
                    description=desc,
                )
            )

        contributions.sort(key=lambda x: x.importance, reverse=True)
        return contributions[:top_n]

    def _calculate_confidence(self, features: dict) -> float:
        """Confidence based on feature completeness and data quality."""
        non_default_count = 0
        for name in FEATURE_NAMES:
            value = features.get(name)
            default = self.preprocessor.MEANS.get(name)
            if value is not None and value != default:
                non_default_count += 1

        completeness = non_default_count / len(FEATURE_NAMES)
        return float(np.clip(0.5 + completeness * 0.45, 0.5, 0.95))

    def get_feature_importance(self) -> dict[str, float]:
        """Return feature importance ranking."""
        importances = {k: abs(v) for k, v in self.FEATURE_WEIGHTS.items()}
        total = sum(importances.values())
        return {k: round(v / total, 4) for k, v in sorted(importances.items(), key=lambda x: -x[1])}
