import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient } from "redis";
import { RedisClient } from "./redis-client.type";

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {

  private redisClient: RedisClient;

  // constructor() {
  //   (async () => {
  //     this.redisClient = await createClient({ url: process.env.REDIS_URL })
  //       .on("error", err => console.log("Redis Client Error", err))
  //       .connect();
  //   })();
  //  }


  async onModuleInit() {
    this.redisClient = await createClient({ url: process.env.REDIS_URL }).on("error", err => console.log("Redis Client Error", err))
      .connect();

    await this.redisClient.set("key", "value");
  }


  public async onModuleDestroy() {
   await this.redisClient.quit();
  }

  public getClient() {
    return this.redisClient;
  }
}
