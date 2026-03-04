HYPERPARAMETERS = {
    "n_estimators": 150,
    "max_depth": 5,
    "learning_rate": 0.08,
    "num_leaves": 31,
    "min_child_samples": 10,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "reg_alpha": 0.1,
    "reg_lambda": 1.0,
    "objective": "binary",
    "metric": "auc",
    "seed": 42,
    "verbose": -1,
}

FEATURE_NAMES = [
    "years_experience",
    "education_level",
    "skill_match_score",
    "interview_score",
    "referral",
    "source_linkedin",
    "source_referral",
    "source_agency",
    "current_tenure",
    "job_relevance",
    "completeness",
    "resume_keyword_match",
]

FIT_THRESHOLDS = {
    "LOW_FIT": 0.3,
    "MODERATE_FIT": 0.55,
    "GOOD_FIT": 0.75,
    "EXCELLENT_FIT": 1.0,
}
