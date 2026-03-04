import numpy as np
from models.attrition.config import FEATURE_NAMES


class AttritionPreprocessor:
    """Preprocessor for attrition prediction features."""

    # Pre-computed normalization stats (from training data or domain knowledge)
    MEANS = {
        "tenure_months": 30.0,
        "salary": 100000.0,
        "salary_percentile": 0.5,
        "grade_level": 5.0,
        "department_turnover_rate": 0.1,
        "performance_rating": 3.0,
        "performance_trend": 0.0,
        "training_hours_ytd": 20.0,
        "training_completion_rate": 0.5,
        "engagement_score": 3.5,
        "manager_tenure_months": 18.0,
        "manager_changed_recently": 0.15,
        "promotion_years_since": 2.0,
        "direct_reports_count": 2.0,
        "is_remote": 0.2,
        "age_group": 3.0,
        "employment_type_full_time": 0.85,
        "department_size": 15.0,
    }

    STDS = {
        "tenure_months": 24.0,
        "salary": 50000.0,
        "salary_percentile": 0.3,
        "grade_level": 2.0,
        "department_turnover_rate": 0.08,
        "performance_rating": 1.0,
        "performance_trend": 0.8,
        "training_hours_ytd": 15.0,
        "training_completion_rate": 0.3,
        "engagement_score": 0.8,
        "manager_tenure_months": 12.0,
        "manager_changed_recently": 0.35,
        "promotion_years_since": 1.5,
        "direct_reports_count": 3.0,
        "is_remote": 0.4,
        "age_group": 1.2,
        "employment_type_full_time": 0.35,
        "department_size": 8.0,
    }

    def preprocess(self, features: dict) -> dict:
        """Apply imputation and basic preprocessing."""
        processed = {}
        for name in FEATURE_NAMES:
            value = features.get(name)
            if value is None:
                value = self.MEANS.get(name, 0)
            if isinstance(value, bool):
                value = 1.0 if value else 0.0
            processed[name] = float(value)
        return processed

    def normalize(self, feature_vector: np.ndarray) -> np.ndarray:
        """Standard scaling normalization."""
        means = np.array([self.MEANS[name] for name in FEATURE_NAMES], dtype=np.float32)
        stds = np.array([self.STDS[name] for name in FEATURE_NAMES], dtype=np.float32)
        stds = np.where(stds == 0, 1, stds)
        return (feature_vector - means) / stds
