import redis
from app.config.settings import settings

r = redis.Redis.from_url(url=settings.REDIS_URL)
