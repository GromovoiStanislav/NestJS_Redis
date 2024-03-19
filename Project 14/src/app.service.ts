import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisClientService } from "@app/redis-client/redis-client.service";
import { RedisClient } from "@app/redis-client/redis-client.type";

@Injectable()
export class AppService implements OnModuleInit {

  client: RedisClient;

  constructor(
    private readonly redisClient: RedisClientService
  ) {
  }

  async onModuleInit() {
    this.client = this.redisClient.getClient();
  }

  async getHello() {
    // const client = this.redisClient.getClient()
    // const value = await client.get("key");
    const value = await this.client.get("key");
    console.log("Value for key from Redis:", value);

    return "Hello World!";
  }


}
