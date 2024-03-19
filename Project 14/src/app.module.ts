import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { config, validationSchema } from "./config";
import { RedisClientModule } from "@app/redis-client";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    RedisClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
