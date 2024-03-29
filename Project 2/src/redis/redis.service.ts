import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import * as Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {

  constructor(
    @Inject("REDIS_CONNECTION") private readonly redis: Redis.Redis
  ) {
  }

  onModuleDestroy() {
    this.redis.quit();
  }

  // Здесь вы можете определить свои методы для взаимодействия с Redis.
  // Например:

  async setValue(key: string, value: string): Promise<string> {
    return this.redis.set(key, value);
  }

  async getValue(key: string): Promise<string> {
    return this.redis.get(key);
  }

  async deleteValue(key: string): Promise<void> {
    await this.redis.del(key);
  }
}

