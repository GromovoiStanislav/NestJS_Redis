import { FactoryProvider } from '@nestjs/common';
import Redis  from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      username: process.env.REDIS_USER || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisInstance.on('error', e => {
      throw new Error(`Redis connection failed: ${e}`);
    });
    return redisInstance;
  },

};