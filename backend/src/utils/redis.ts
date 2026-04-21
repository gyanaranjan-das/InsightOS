import Redis from 'ioredis';

let redis: Redis | null = null;

export async function connectRedis(): Promise<void> {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  try {
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });

    redis.on('error', (err) => {
      console.warn('⚠️  Redis error (operating without cache):', err.message);
    });

    await redis.ping();
    console.log('✅ Connected to Redis');
  } catch {
    console.warn('⚠️  Redis unavailable — running without cache');
    redis = null;
  }
}

export function getRedis(): Redis | null {
  return redis;
}

export async function cacheGet(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds = 60): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, ttlSeconds, value);
  } catch {
    /* noop */
  }
}

export async function cacheDel(pattern: string): Promise<void> {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    /* noop */
  }
}

export async function blacklistToken(token: string, ttlSeconds: number): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(`bl:${token}`, ttlSeconds, '1');
  } catch {
    /* noop */
  }
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  if (!redis) return false;
  try {
    const result = await redis.get(`bl:${token}`);
    return result === '1';
  } catch {
    return false;
  }
}
