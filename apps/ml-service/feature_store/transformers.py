from datetime import datetime, timezone


def months_between(start: datetime, end: datetime | None = None) -> float:
    end = end or datetime.now(timezone.utc)
    if start.tzinfo is None:
        start = start.replace(tzinfo=timezone.utc)
    if end.tzinfo is None:
        end = end.replace(tzinfo=timezone.utc)
    delta = end - start
    return round(delta.days / 30.44, 1)


def grade_to_numeric(grade: str | None) -> int:
    if not grade:
        return 3
    grade = grade.upper().strip()
    if grade.startswith("L"):
        try:
            return int(grade[1:])
        except ValueError:
            return 3
    return 3


def rating_to_numeric(rating: str | None) -> float:
    mapping = {
        "EXCEPTIONAL": 5.0,
        "EXCEEDS_EXPECTATIONS": 4.0,
        "MEETS_EXPECTATIONS": 3.0,
        "NEEDS_IMPROVEMENT": 2.0,
        "UNSATISFACTORY": 1.0,
    }
    return mapping.get(rating or "", 3.0)


def education_to_numeric(education: str) -> int:
    mapping = {
        "high_school": 1,
        "bachelor": 2,
        "master": 3,
        "phd": 4,
    }
    return mapping.get(education.lower(), 2)


def percentile(value: float, values: list[float]) -> float:
    if not values:
        return 0.5
    below = sum(1 for v in values if v < value)
    return round(below / len(values), 4)
