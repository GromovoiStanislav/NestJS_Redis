import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from "./app.service";


@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {
  }

  @Get("redis-ping")
  redisPing() {
    return this.appService.redisPing();
  }

  @Get("message")
  getMessage() {
    return this.appService.getSingleNewMessage();
  }

  @Get("messages")
  getMessages() {
    return this.appService.getMultipleNewMessages(3);
  }

  @Get("consume/:group/:consumer/:count")
  consumeMessages(
    @Param("group") group: string,
    @Param("consumer") consumer: string,
    @Param("count") count: number
  ) {
    return this.appService.consumeMessageFromGroup(group, consumer, count);
  }

}
