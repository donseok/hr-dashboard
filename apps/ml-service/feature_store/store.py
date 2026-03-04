import json
import redis.asyncio as redis
from datetime import datetime, timezone

from core.config import settings
from core.database import fetch_one, fetch_all
from core.logging import get_logger
from feature_store.transformers import (
    months_between,
    grade_to_numeric,
    rating_to_numeric,
    percentile,
)

logger = get_logger(__name__)

_redis: redis.Redis | None = None


async def init_redis() -> None:
    global _redis
    try:
        _redis = redis.from_url(settings.redis_url, decode_responses=True)
        await _redis.ping()
        logger.info("Redis connected")
    except Exception as e:
        logger.warning(f"Redis not available, using DB-only mode: {e}")
        _redis = None


async def close_redis() -> None:
    global _redis
    if _redis:
        await _redis.aclose()
        _redis = None


async def _cache_get(key: str) -> dict | None:
    if not _redis:
        return None
    try:
        data = await _redis.get(key)
        return json.loads(data) if data else None
    except Exception:
        return None


async def _cache_set(key: str, value: dict, ttl: int | None = None) -> None:
    if not _redis:
        return
    try:
        await _redis.set(key, json.dumps(value, default=str), ex=ttl or settings.feature_cache_ttl)
    except Exception:
        pass


async def get_employee_features(employee_id: str) -> dict | None:
    cache_key = f"features:attrition:{employee_id}"
    cached = await _cache_get(cache_key)
    if cached:
        return cached

    # Fetch from PostgreSQL
    employee = await fetch_one(
        """
        SELECT e.id, e.first_name, e.last_name, e.hire_date, e.salary,
               e.grade, e.department_id, e.manager_id, e.status,
               e.employment_type, e.location, e.metadata,
               d.name as department_name
        FROM employees e
        JOIN departments d ON e.department_id = d.id
        WHERE e.id = $1
        """,
        employee_id,
    )

    if not employee:
        return None

    now = datetime.now(timezone.utc)

    # Performance rating
    perf = await fetch_one(
        """
        SELECT pr.rating FROM performance_reviews pr
        JOIN performance_cycles pc ON pr.cycle_id = pc.id
        WHERE pr.employee_id = $1 AND pr.submitted_at IS NOT NULL
        ORDER BY pc.end_date DESC LIMIT 1
        """,
        employee_id,
    )

    # Previous performance rating (for trend)
    prev_perf = await fetch_one(
        """
        SELECT pr.rating FROM performance_reviews pr
        JOIN performance_cycles pc ON pr.cycle_id = pc.id
        WHERE pr.employee_id = $1 AND pr.submitted_at IS NOT NULL
        ORDER BY pc.end_date DESC LIMIT 1 OFFSET 1
        """,
        employee_id,
    )

    # Training stats
    training = await fetch_one(
        """
        SELECT
            COALESCE(SUM(CASE WHEN te.status = 'COMPLETED' THEN tp.duration ELSE 0 END), 0) as total_hours,
            COUNT(*) as total_enrollments,
            COUNT(CASE WHEN te.status = 'COMPLETED' THEN 1 END) as completed
        FROM training_enrollments te
        JOIN training_programs tp ON te.program_id = tp.id
        WHERE te.employee_id = $1
        """,
        employee_id,
    )

    # Engagement score
    engagement = await fetch_one(
        """
        SELECT sr.score FROM survey_responses sr
        JOIN surveys s ON sr.survey_id = s.id
        WHERE sr.employee_id = $1 AND s.type = 'PULSE' AND sr.score IS NOT NULL
        ORDER BY sr.submitted_at DESC LIMIT 1
        """,
        employee_id,
    )

    # Department turnover rate
    dept_turnover = await fetch_one(
        """
        SELECT
            COUNT(CASE WHEN e.status = 'TERMINATED' THEN 1 END)::float /
            NULLIF(COUNT(*), 0) as turnover_rate
        FROM employees e
        WHERE e.department_id = $1
        """,
        employee["department_id"],
    )

    # Salary percentile within grade
    grade_salaries = await fetch_all(
        "SELECT salary FROM employees WHERE grade = $1 AND salary IS NOT NULL AND status = 'ACTIVE'",
        employee["grade"],
    )
    salary_values = [float(r["salary"]) for r in grade_salaries]

    # Direct reports
    direct_reports = await fetch_one(
        "SELECT COUNT(*) as count FROM employees WHERE manager_id = $1 AND status = 'ACTIVE'",
        employee_id,
    )

    # Department size
    dept_size = await fetch_one(
        "SELECT COUNT(*) as count FROM employees WHERE department_id = $1 AND status = 'ACTIVE'",
        employee["department_id"],
    )

    current_rating = rating_to_numeric(perf["rating"] if perf else None)
    prev_rating = rating_to_numeric(prev_perf["rating"] if prev_perf else None)

    features = {
        "employee_id": employee_id,
        "tenure_months": months_between(employee["hire_date"]),
        "salary": float(employee["salary"] or 0),
        "salary_percentile": percentile(float(employee["salary"] or 0), salary_values),
        "grade_level": grade_to_numeric(employee["grade"]),
        "department_turnover_rate": float(dept_turnover["turnover_rate"] or 0) if dept_turnover else 0,
        "performance_rating": current_rating,
        "performance_trend": current_rating - prev_rating,
        "training_hours_ytd": float(training["total_hours"]) if training else 0,
        "training_completion_rate": (
            float(training["completed"]) / float(training["total_enrollments"])
            if training and training["total_enrollments"] > 0
            else 0
        ),
        "engagement_score": float(engagement["score"]) if engagement else 3.5,
        "manager_tenure_months": months_between(employee["hire_date"]),  # simplified
        "manager_changed_recently": False,
        "promotion_years_since": months_between(employee["hire_date"]) / 12,  # simplified
        "direct_reports_count": direct_reports["count"] if direct_reports else 0,
        "is_remote": employee["location"] != "Seoul" if employee["location"] else False,
        "age_group": 3,  # simplified
        "employment_type_full_time": employee["employment_type"] == "FULL_TIME",
        "department_size": dept_size["count"] if dept_size else 10,
    }

    await _cache_set(cache_key, features)
    return features
