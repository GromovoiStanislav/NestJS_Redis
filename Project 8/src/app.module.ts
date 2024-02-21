import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "./redis/redis.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";


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
