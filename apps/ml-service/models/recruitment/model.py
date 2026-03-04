import numpy as np
from datetime import datetime, timezone

from core.logging import get_logger
from models.recruitment.config import FEATURE_NAMES, FIT_THRESHOLDS
from models.recruitment.features import extract_candidate_features
from models.recruitment.preprocessor import RecruitmentPreprocessor
from schemas.prediction import RecruitmentResult, CandidateFeatures

logger = get_logger(__name__)


class RecruitmentModel:
    """
    LightGBM-based recruitment fit prediction model.

    Uses a weighted scoring simulation that mirrors LightGBM patterns.
    """

    VERSION = "1.0.0"
    MODEL_TYPE = "lightgbm"

    FEATURE_WEIGHTS = {
        "years_experience": 0.12,
        "education_level": 0.06,
        "skill_match_score": 0.22,
        "interview_score": 0.20,
        "referral": 0.08,
        "source_linkedin": 0.02,
        "source_referral": 0.04,
        "source_agency": -0.02,
        "current_tenure": 0.05,
        "job_relevance": 0.15,
        "completeness": 0.04,
        "resume_keyword_match": 0.10,
    }

    def __init__(self):
        self.preprocessor = RecruitmentPreprocessor()
        self._is_loaded = True
        logger.info(f"RecruitmentModel v{self.VERSION} initialized (simulated)")

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    def predict(self, candidate: CandidateFeatures, candidate_id: str | None = None) -> RecruitmentResult:
        features = extract_candidate_features(candidate)
        processed = self.preprocessor.preprocess(features)

        fit_score = self._calculate_fit_score(processed)
        fit_level = self._get_fit_level(fit_score)
        perf_prediction = self._predict_performance(fit_score)
        retention = self._estimate_retention(processed, fit_score)
        strengths = self._identify_strengths(processed)
        risks = self._identify_risks(processed)
        confidence = self._calculate_confidence(processed)

        return RecruitmentResult(
            candidate_id=candidate_id,
            fit_score=round(fit_score, 4),
            fit_level=fit_level,
            predicted_performance=perf_prediction,
            estimated_retention_months=retention,
            top_strengths=strengths,
            risk_flags=risks,
            confidence=round(confidence, 4),
            predicted_at=datetime.now(timezone.utc),
        )

    def _calculate_fit_score(self, features: dict) -> float:
        score = 0.0
        for name, weight in self.FEATURE_WEIGHTS.items():
            value = features.get(name, 0)
            mean = self.preprocessor.MEANS.get(name, 0)
            std = self.preprocessor.STDS.get(name, 1) or 1
            normalized = (value - mean) / std
            score += weight * normalized

        # Sigmoid transform
        score = 1 / (1 + np.exp(-score * 2))
        return float(np.clip(score, 0.05, 0.99))

    def _get_fit_level(self, score: float) -> str:
        for level, threshold in FIT_THRESHOLDS.items():
            if score <= threshold:
                return level
        return "EXCELLENT_FIT"

    def _predict_performance(self, fit_score: float) -> str:
        if fit_score >= 0.8:
            return "TOP_PERFORMER"
        elif fit_score >= 0.6:
            return "ABOVE_AVERAGE"
        elif fit_score >= 0.4:
            return "AVERAGE"
        return "BELOW_AVERAGE"

    def _estimate_retention(self, features: dict, fit_score: float) -> int:
        base = 18
        base += int(fit_score * 24)
        base += int(features.get("current_tenure", 0) * 3)
        if features.get("referral", 0) > 0.5:
            base += 6
        return min(base, 60)

    def _identify_strengths(self, features: dict) -> list[str]:
        strengths = []
        if features.get("skill_match_score", 0) >= 0.7:
            strengths.append("Strong skill match")
        if features.get("interview_score", 0) >= 4.0:
            strengths.append("Excellent interview performance")
        if features.get("years_experience", 0) >= 5:
            strengths.append("Significant industry experience")
        if features.get("referral", 0) > 0.5:
            strengths.append("Employee referral")
        if features.get("education_level", 0) >= 3:
            strengths.append("Advanced degree")
        if features.get("job_relevance", 0) >= 0.7:
            strengths.append("High job relevance")
        if features.get("resume_keyword_match", 0) >= 0.7:
            strengths.append("Strong resume keyword match")
        return strengths[:5]

    def _identify_risks(self, features: dict) -> list[str]:
        risks = []
        if features.get("current_tenure", 0) < 1:
            risks.append("Short tenure at current company (potential job hopper)")
        if features.get("skill_match_score", 0) < 0.3:
            risks.append("Low skill match for role")
        if features.get("completeness", 1) < 0.7:
            risks.append("Incomplete application")
        if features.get("interview_score", 5) < 2.5:
            risks.append("Below-average interview score")
        if features.get("years_experience", 0) < 1:
            risks.append("Limited experience")
        return risks

    def _calculate_confidence(self, features: dict) -> float:
        has_interview = features.get("interview_score", 0) > 0
        has_skills = features.get("skill_match_score", 0) > 0
        has_relevance = features.get("job_relevance", 0) > 0

        base = 0.6
        if has_interview:
            base += 0.15
        if has_skills:
            base += 0.1
        if has_relevance:
            base += 0.1
        return float(np.clip(base, 0.5, 0.95))
