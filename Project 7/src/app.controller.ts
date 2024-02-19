import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get(":key")
  async getKey(@Param('key') key: string) {
    return this.appService.getKey(key);
  }

  @Post(":key/:value")
  async setKey(@Param('key') key: string, @Param('value') value: string) {
    return this.appService.setKey(key, value);
  }

  @Delete(":key")
  async delKey(@Param('key') key: string) {
    return this.appService.delKey(key);
  }

}
