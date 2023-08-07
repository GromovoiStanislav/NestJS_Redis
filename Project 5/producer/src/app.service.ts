import { Injectable } from "@nestjs/common";
import { RedisService } from "./redis/redis.service";


@Injectable()
export class AppService {

  constructor(
    private readonly redisService: RedisService
  ) {
  }

  getHello(): string {
    return "Hello World!";
  }

  async createProduct(product: { name: string; id: number }) {
    await this.redisService.publish("products", product);
    return "OK";
  }
}
