import numpy as np
from models.recruitment.config import FEATURE_NAMES


class RecruitmentPreprocessor:
    """Preprocessor for recruitment prediction features."""

    MEANS = {
        "years_experience": 5.0,
        "education_level": 2.5,
        "skill_match_score": 0.5,
        "interview_score": 3.5,
        "referral": 0.2,
        "source_linkedin": 0.35,
        "source_referral": 0.2,
        "source_agency": 0.1,
        "current_tenure": 2.5,
        "job_relevance": 0.5,
        "completeness": 0.85,
        "resume_keyword_match": 0.5,
    }

    STDS = {
        "years_experience": 4.0,
        "education_level": 1.0,
        "skill_match_score": 0.25,
        "interview_score": 1.0,
        "referral": 0.4,
        "source_linkedin": 0.48,
        "source_referral": 0.4,
        "source_agency": 0.3,
        "current_tenure": 2.0,
        "job_relevance": 0.25,
        "completeness": 0.15,
        "resume_keyword_match": 0.25,
    }

    def preprocess(self, features: dict) -> dict:
        processed = {}
        for name in FEATURE_NAMES:
            value = features.get(name)
            if value is None:
                value = self.MEANS.get(name, 0)
            processed[name] = float(value)
        return processed
