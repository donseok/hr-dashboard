from dataclasses import dataclass


@dataclass
class FeatureDefinition:
    name: str
    dtype: str  # float, int, str, bool
    source: str  # employee, performance, training, survey, derived
    description: str
    default: float | int | str | bool | None = None


ATTRITION_FEATURES: list[FeatureDefinition] = [
    FeatureDefinition("tenure_months", "float", "employee", "Months since hire date"),
    FeatureDefinition("salary", "float", "employee", "Current annual salary"),
    FeatureDefinition("salary_percentile", "float", "derived", "Salary percentile within grade", 0.5),
    FeatureDefinition("grade_level", "int", "employee", "Numeric grade level (1-10)", 3),
    FeatureDefinition("department_turnover_rate", "float", "derived", "Department's historical turnover rate", 0.1),
    FeatureDefinition("performance_rating", "float", "performance", "Latest performance rating (1-5)", 3.0),
    FeatureDefinition("performance_trend", "float", "derived", "Change in rating vs previous cycle", 0.0),
    FeatureDefinition("training_hours_ytd", "float", "training", "Training hours completed this year", 0.0),
    FeatureDefinition("training_completion_rate", "float", "training", "Ratio of completed trainings", 0.0),
    FeatureDefinition("engagement_score", "float", "survey", "Latest survey engagement score", 3.5),
    FeatureDefinition("manager_tenure_months", "float", "derived", "Months under current manager", 12.0),
    FeatureDefinition("manager_changed_recently", "bool", "derived", "Manager changed in last 6 months", False),
    FeatureDefinition("promotion_years_since", "float", "derived", "Years since last promotion", 2.0),
    FeatureDefinition("direct_reports_count", "int", "employee", "Number of direct reports", 0),
    FeatureDefinition("is_remote", "bool", "employee", "Whether employee works remotely", False),
    FeatureDefinition("age_group", "int", "employee", "Age group bucket (1-5)", 3),
    FeatureDefinition("employment_type_full_time", "bool", "employee", "Full-time employee", True),
    FeatureDefinition("department_size", "int", "derived", "Number of employees in department", 10),
]

RECRUITMENT_FEATURES: list[FeatureDefinition] = [
    FeatureDefinition("years_experience", "float", "candidate", "Total years of experience"),
    FeatureDefinition("education_level", "int", "candidate", "Education level numeric (1-4)", 2),
    FeatureDefinition("skill_match_score", "float", "candidate", "Skill matching score", 0.5),
    FeatureDefinition("interview_score", "float", "candidate", "Average interview score", 0.0),
    FeatureDefinition("referral", "bool", "candidate", "Is a referral candidate", False),
    FeatureDefinition("source_linkedin", "bool", "candidate", "Sourced from LinkedIn", False),
    FeatureDefinition("source_referral", "bool", "candidate", "Sourced from referral", False),
    FeatureDefinition("source_agency", "bool", "candidate", "Sourced from agency", False),
    FeatureDefinition("current_tenure", "float", "candidate", "Tenure at current company (years)", 0.0),
    FeatureDefinition("job_relevance", "float", "candidate", "Job relevance score", 0.5),
    FeatureDefinition("completeness", "float", "candidate", "Application completeness", 1.0),
    FeatureDefinition("resume_keyword_match", "float", "candidate", "Resume keyword match score", 0.5),
]
