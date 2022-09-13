import redis
from app.config.settings import settings

r = redis.Redis.from_url(url=settings.REDIS_URL)

print(r)
r.set('foo', 'bar')
value = r.get('foo')
print(value)
print("testing")
