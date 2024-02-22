import { Controller, Get } from "@nestjs/common";
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

  @Get('message')
  getMessage() {
    return this.appService.getSingleNewMessage();
  }

  @Get('messages')
  getMessages() {
    return this.appService.getMultipleNewMessages(3);
  }

}
