import { Module } from "@nestjs/common";
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";


@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "single",
        url: configService.get<string>("REDIS_URL")
      }),
      inject: [ConfigService],
      imports: []
    })
  ],
  providers: [RedisService],
  exports: [RedisService]
})
export class _RedisModule {
}