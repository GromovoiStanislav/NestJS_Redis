import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { HttpclientModule } from "../httpclient/httpclient.module";
import { _RedisModule } from "../redis/redis.module";

@Module({
  imports: [HttpclientModule, _RedisModule],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {
}
