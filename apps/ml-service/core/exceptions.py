from fastapi import HTTPException


class ModelNotFoundError(HTTPException):
    def __init__(self, model_name: str):
        super().__init__(status_code=404, detail=f"Model '{model_name}' not found or not loaded")


class PredictionError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=500, detail=f"Prediction failed: {detail}")


class FeatureExtractionError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=422, detail=f"Feature extraction failed: {detail}")


class EmployeeNotFoundError(HTTPException):
    def __init__(self, employee_id: str):
        super().__init__(status_code=404, detail=f"Employee '{employee_id}' not found")


class InvalidInputError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)
