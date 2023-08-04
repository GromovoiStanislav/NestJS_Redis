import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import { REDIS_CLIENT, RedisClient } from "./redis-client.type";

@Injectable()
export class RedisService implements OnModuleDestroy {

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient
  ) {
  }

  onModuleDestroy(): any {
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

