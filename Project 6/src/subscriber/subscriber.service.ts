import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Redis from 'ioredis';
import {CHANNEL_example} from "../common/const";
import {Cron, CronExpression} from "@nestjs/schedule";


@Injectable()
export class SubscriberService {
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

    onModuleInit() {
        this.redis.subscribe(CHANNEL_example);

        this.redis.on("message", (channel, message) => {
            console.log(`Received ${message} from ${channel}`);
        });

        // There's also an event called 'messageBuffer', which is the same as 'message' except
        // it returns buffers instead of strings.
        // It's useful when the messages are binary data.
        this.redis.on("messageBuffer", (channel, message) => {
            console.log(channel.toString(), message.toString());
        });
    }

}