import asyncpg
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from core.config import settings
from core.logging import get_logger

logger = get_logger(__name__)

_pool: asyncpg.Pool | None = None


async def init_db() -> None:
    global _pool
    try:
        _pool = await asyncpg.create_pool(
            dsn=settings.database_url,
            min_size=2,
            max_size=10,
            command_timeout=30,
        )
        logger.info("Database pool created")
    except Exception as e:
        logger.error(f"Failed to create database pool: {e}")
        _pool = None


async def close_db() -> None:
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
        logger.info("Database pool closed")


@asynccontextmanager
async def get_connection() -> AsyncGenerator[asyncpg.Connection, None]:
    if not _pool:
        raise RuntimeError("Database pool not initialized")
    async with _pool.acquire() as conn:
        yield conn


async def fetch_one(query: str, *args) -> dict | None:
    async with get_connection() as conn:
        row = await conn.fetchrow(query, *args)
        return dict(row) if row else None


async def fetch_all(query: str, *args) -> list[dict]:
    async with get_connection() as conn:
        rows = await conn.fetch(query, *args)
        return [dict(r) for r in rows]
