import numpy as np
from models.attrition.config import FEATURE_NAMES


def extract_feature_vector(features: dict) -> np.ndarray:
    """Convert feature dict to numpy array in the expected order."""
    vector = []
    for name in FEATURE_NAMES:
        value = features.get(name, 0)
        if isinstance(value, bool):
            value = 1.0 if value else 0.0
        vector.append(float(value))
    return np.array(vector, dtype=np.float32)


def validate_features(features: dict) -> list[str]:
    """Validate feature dict and return list of missing features."""
    missing = []
    for name in FEATURE_NAMES:
        if name not in features:
            missing.append(name)
    return missing
