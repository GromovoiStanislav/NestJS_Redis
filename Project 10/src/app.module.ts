import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@nestjs-modules/ioredis";
import { AppController } from "./app.controller";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "single",
        url: configService.get<string>("REDIS_URL")
      }),
      inject: [ConfigService],
      imports: []
    })
  ],
  controllers: [AppController]
})
export class AppModule {
}
