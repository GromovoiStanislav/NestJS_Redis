import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import { REDIS_CLIENT, RedisClient } from "./redis-client.type";

@Injectable()
export class RedisService implements OnModuleDestroy {

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient
  ) {
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  getClient() {
    return this.redisClient;
  }

  // Здесь вы можете определить свои методы для взаимодействия с Redis
}

