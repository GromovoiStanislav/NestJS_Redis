import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  Redis from 'ioredis';
import { RedisService } from './redis.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CONNECTION',
      useFactory: (configService: ConfigService) => {
        return new Redis(configService.get<string>('REDIS_URL') || "redis://127.0.0.1:6379");
        // return new Redis({
        //   host: configService.get('REDIS_HOST'),
        //   port: parseInt(configService.get('REDIS_PORT')),
        //   // Дополнительные параметры подключения к Redis, если необходимо
        // });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
