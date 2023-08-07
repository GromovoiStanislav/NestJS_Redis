import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import { REDIS_CLIENT, RedisClient } from "./redis-client.type";

@Injectable()
export class RedisService implements OnModuleDestroy {

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient
  ) {
  }

  onModuleDestroy() {
    this.redis.quit();
  }

  // Здесь вы можете определить свои методы для взаимодействия с Redis.
  // Например:

  async publish(channel: string, value: any) {
    this.redis.publish(channel, JSON.stringify(value));
  }

}

