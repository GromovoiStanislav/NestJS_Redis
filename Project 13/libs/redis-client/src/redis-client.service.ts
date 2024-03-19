import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { createClient } from "redis";
import { RedisClient } from "./redis-client.type";

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {
  private redisClient: RedisClient;

  async onModuleInit() {
    this.redisClient = await createClient({ url: process.env.REDIS_URL })
      .on("error", err => console.log("Redis Client Error", err))
      .connect();
  }

  public async onModuleDestroy() {
    await this.redisClient.quit();
  }

  public getClient() {
    return this.redisClient;
  }

}
