HYPERPARAMETERS = {
    "n_estimators": 200,
    "max_depth": 6,
    "learning_rate": 0.05,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "min_child_weight": 3,
    "gamma": 0.1,
    "reg_alpha": 0.1,
    "reg_lambda": 1.0,
    "scale_pos_weight": 3.0,  # imbalanced classes (more active than terminated)
    "objective": "binary:logistic",
    "eval_metric": "auc",
    "seed": 42,
}

FEATURE_NAMES = [
    "tenure_months",
    "salary",
    "salary_percentile",
    "grade_level",
    "department_turnover_rate",
    "performance_rating",
    "performance_trend",
    "training_hours_ytd",
    "training_completion_rate",
    "engagement_score",
    "manager_tenure_months",
    "manager_changed_recently",
    "promotion_years_since",
    "direct_reports_count",
    "is_remote",
    "age_group",
    "employment_type_full_time",
    "department_size",
]

FEATURE_DESCRIPTIONS = {
    "tenure_months": "Tenure (months)",
    "salary": "Annual Salary",
    "salary_percentile": "Salary Percentile (within grade)",
    "grade_level": "Grade Level",
    "department_turnover_rate": "Department Turnover Rate",
    "performance_rating": "Performance Rating",
    "performance_trend": "Performance Trend",
    "training_hours_ytd": "Training Hours (YTD)",
    "training_completion_rate": "Training Completion Rate",
    "engagement_score": "Engagement Score",
    "manager_tenure_months": "Manager Tenure (months)",
    "manager_changed_recently": "Recent Manager Change",
    "promotion_years_since": "Years Since Promotion",
    "direct_reports_count": "Direct Reports Count",
    "is_remote": "Remote Worker",
    "age_group": "Age Group",
    "employment_type_full_time": "Full-time Employment",
    "department_size": "Department Size",
}

RISK_THRESHOLDS = {
    "LOW": 0.2,
    "MEDIUM": 0.4,
    "HIGH": 0.6,
    "CRITICAL": 1.0,
}
