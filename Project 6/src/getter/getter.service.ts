import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Redis from 'ioredis';
import {Cron, CronExpression} from "@nestjs/schedule";


@Injectable()
export class GetterService {
    private readonly redis: Redis;

    constructor(
        private readonly config: ConfigService
    ) {
        this.redis = new Redis({
            host: config.get('REDIS_HOST') || '127.0.0.1',
            port: this.config.get('REDIS_PORT') || 6379,
            username: config.get('REDIS_USER') || undefined,
            password: config.get('REDIS_PASSWORD') || undefined,
        });
    }

    @Cron(CronExpression.EVERY_SECOND)
    async get() {
        console.log("mykey", await this.redis.get("mykey"))
    }

}