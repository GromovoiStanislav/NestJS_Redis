import { Inject, Injectable } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Injectable()
export class AppService {

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService
  ) {
  }

  async getHello(): Promise<string> {
    return `Hello World! (${await this.redisService.incrHello("1")})`;
  }

}