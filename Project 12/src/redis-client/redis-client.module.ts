import { Module } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { RedisClientService } from './redis-client.service';
import { REDIS_CLIENT, RedisClient } from "./redis-client.type";

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService): Promise<RedisClient> => {
        const client = createClient({
          url: configService.get<string>("redisUrl")
        });
        client.on("error", err => console.log("Redis Client Error", err));
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    },
    RedisClientService
  ],
  exports: [RedisClientService]
})
export class RedisClientModule {}
