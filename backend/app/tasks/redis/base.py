import redis
from app.core.config.settings import settings

r = redis.Redis.from_url(url=settings.REDIS_URL)
