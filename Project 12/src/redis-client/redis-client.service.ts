import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { REDIS_CLIENT, RedisClient } from "./redis-client.type";

@Injectable()
export class RedisClientService implements OnModuleDestroy {

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient
  ) {
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  getClient() {
    return this.redisClient;
  }

}
