import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisService } from "./redis/redis.service";
import { RedisClient } from "./redis/redis-client.type";


@Injectable()
export class AppService implements OnModuleInit {

  private readonly products = [];
  private readonly subscriber: RedisClient;

  constructor(
    private readonly redisService: RedisService
  ) {
    this.subscriber = redisService.getClient()
  }

  async onModuleInit() {
    this.subscriber.subscribe('products',  (message, channel) => {
      console.log(channel, message);
      this.products.push(JSON.parse(message));
    });
  }


  getHello(): string {
    return "Hello World!";
  }

  getProducts() {
    return this.products;
  }

}
