from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "HR ML Service"
    app_version: str = "0.1.0"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 8001

    # Database (read-only)
    database_url: str = "postgresql://postgres:postgres@localhost:5432/hr_dashboard"

    # Redis
    redis_url: str = "redis://localhost:6379/1"

    # Model paths
    model_dir: str = "./model_artifacts"

    # Feature Store
    feature_cache_ttl: int = 3600  # 1 hour

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:4000"]

    # NestJS API
    api_base_url: str = "http://localhost:4000"

    model_config = {"env_prefix": "ML_", "env_file": ".env"}


settings = Settings()
