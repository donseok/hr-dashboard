import numpy as np
from feature_store.transformers import education_to_numeric
from models.recruitment.config import FEATURE_NAMES
from schemas.prediction import CandidateFeatures


def extract_candidate_features(candidate: CandidateFeatures) -> dict:
    """Convert CandidateFeatures to feature dict."""
    source = candidate.source.lower()
    return {
        "years_experience": candidate.years_experience,
        "education_level": education_to_numeric(candidate.education_level),
        "skill_match_score": candidate.skill_match_score,
        "interview_score": candidate.interview_score or 0.0,
        "referral": 1.0 if candidate.referral else 0.0,
        "source_linkedin": 1.0 if "linkedin" in source else 0.0,
        "source_referral": 1.0 if "referral" in source else 0.0,
        "source_agency": 1.0 if "agency" in source else 0.0,
        "current_tenure": candidate.current_company_tenure,
        "job_relevance": candidate.job_relevance_score,
        "completeness": candidate.application_completeness,
        "resume_keyword_match": candidate.resume_keyword_match,
    }


def to_feature_vector(features: dict) -> np.ndarray:
    return np.array([features.get(name, 0) for name in FEATURE_NAMES], dtype=np.float32)
