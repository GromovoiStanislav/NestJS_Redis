import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { HttpclientModule } from "src/httpclient/httpclient.module";
import { _RedisModule } from "src/redis/redis.module";


@Module({
  imports: [HttpclientModule, _RedisModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {
}
