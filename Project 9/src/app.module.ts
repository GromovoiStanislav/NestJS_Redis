import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OrderModule } from "./order/order.module";
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrderModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
