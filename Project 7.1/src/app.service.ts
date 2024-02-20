import { Inject, Injectable } from "@nestjs/common";
import { RedisRepository } from "./redis/redis.repository";

@Injectable()
export class AppService {

  private readonly  Prefix = 'hello'

  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async getKey(key: string) {
    return this.redisRepository.get(this.Prefix, key);
  }

  async setKey(key: string, value: string) {
    //this.redisRepository.set(this.Prefix, key, value);
    await this.redisRepository.setWithExpiry(this.Prefix, key, value, 60);
    return 'OK'
  }


  async delKey(key: string) {
    await this.redisRepository.delete(this.Prefix, key);
    return 'OK'
  }
}
