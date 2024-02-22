import { Injectable } from '@nestjs/common';
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class AppService
{
  constructor(
    private readonly redisService: RedisService,
  ) {}

  redisPing() {
    return this.redisService.ping();
  }

}
