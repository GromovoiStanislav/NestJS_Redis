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

  async setKey(key: string, value: string) {
    await this.redisService.setValue(key, value);
    return "OK";
  }

  async getKey(key: string) {
    return this.redisService.getValue(key);
  }

  async deleteKey(key: string) {
    await this.redisService.deleteValue(key);
    return "OK";
  }
}
