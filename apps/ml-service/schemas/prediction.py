from pydantic import BaseModel, Field
from datetime import datetime


# ─── Attrition ────────────────────────────────────────────

class AttritionPredictionRequest(BaseModel):
    employee_id: str


class AttritionBatchRequest(BaseModel):
    employee_ids: list[str] = Field(..., min_length=1, max_length=500)


class AttritionFactor(BaseModel):
    feature: str
    importance: float = Field(ge=0, le=1)
    value: float
    description: str


class AttritionResult(BaseModel):
    employee_id: str
    risk_score: float = Field(ge=0, le=1)
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    top_factors: list[AttritionFactor]
    confidence: float = Field(ge=0, le=1)
    predicted_at: datetime


class AttritionBatchResponse(BaseModel):
    predictions: list[AttritionResult]
    total: int
    high_risk_count: int
    avg_risk_score: float


# ─── Recruitment ──────────────────────────────────────────

class CandidateFeatures(BaseModel):
    source: str = "unknown"
    years_experience: float = 0
    education_level: str = "bachelor"  # high_school, bachelor, master, phd
    skill_match_score: float = Field(default=0.5, ge=0, le=1)
    interview_score: float | None = None
    referral: bool = False
    current_company_tenure: float = 0
    job_relevance_score: float = Field(default=0.5, ge=0, le=1)
    application_completeness: float = Field(default=1.0, ge=0, le=1)
    resume_keyword_match: float = Field(default=0.5, ge=0, le=1)


class RecruitmentPredictionRequest(BaseModel):
    candidate_id: str | None = None
    features: CandidateFeatures


class RecruitmentResult(BaseModel):
    candidate_id: str | None
    fit_score: float = Field(ge=0, le=1)
    fit_level: str  # LOW_FIT, MODERATE_FIT, GOOD_FIT, EXCELLENT_FIT
    predicted_performance: str  # BELOW_AVERAGE, AVERAGE, ABOVE_AVERAGE, TOP_PERFORMER
    estimated_retention_months: int
    top_strengths: list[str]
    risk_flags: list[str]
    confidence: float = Field(ge=0, le=1)
    predicted_at: datetime


# ─── Sentiment ────────────────────────────────────────────

class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    language: str = "ko"  # ko or en


class SentimentResult(BaseModel):
    sentiment: str  # positive, neutral, negative
    score: float = Field(ge=-1, le=1)
    confidence: float = Field(ge=0, le=1)
    positive_score: float = Field(ge=0, le=1)
    neutral_score: float = Field(ge=0, le=1)
    negative_score: float = Field(ge=0, le=1)
    keywords: list[str]
    aspects: list[dict]  # [{aspect: str, sentiment: str, score: float}]
    predicted_at: datetime
