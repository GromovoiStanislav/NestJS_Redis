import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { RedisService } from "./redis.service";
import { REDIS_CLIENT, RedisClient } from "./redis-client.type";

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService): Promise<RedisClient> => {
        const client = createClient({
          url: configService.get<string>("REDIS_URL") || "redis://127.0.0.1:6379"
        });
        client.on("error", err => console.log("Redis Client Error", err));
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    },
    RedisService
  ],
  exports: [RedisService]
})
export class RedisModule {
}
