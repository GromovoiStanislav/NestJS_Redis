import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Cron, CronExpression} from '@nestjs/schedule';
import {randomUUID} from 'crypto';
import Redis from 'ioredis';
import {CHANNEL_example} from "../common/const";


@Injectable()
export class PublisherService {
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

    @Cron(CronExpression.EVERY_5_SECONDS)
    publish() {
        this.redis.publish(CHANNEL_example, JSON.stringify({uuid: randomUUID()}));
    }

    @Cron(CronExpression.EVERY_SECOND)
    set() {
        this.redis.incr("mykey");
    }
}