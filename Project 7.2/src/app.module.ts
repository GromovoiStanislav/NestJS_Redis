import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "./redis/redis.module";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app.service";
import { PasswordController } from "./controllers/password.controller";
import { PasswordService } from "./services/password.service";
import { RedisService } from "./services/redis.service";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule
  ],
  controllers: [
    AppController,
    ProductController,
    PasswordController
  ],
  providers: [
    AppService,
    ProductService,
    PasswordService,
    RedisService
  ]
})
export class AppModule {
}
