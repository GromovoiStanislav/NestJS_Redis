import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { RedisModule } from "src/redis/redis.module";
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
