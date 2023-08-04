import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {
  }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get("redis/:key")
  async getKey(@Param("key") key: string) {
    return this.appService.getKey(key);
  }


  @Post("redis/:key/:value")
  async setKey(
    @Param("key") key: string,
    @Param("value") value: string
  ) {
    return this.appService.setKey(key, value);
  }


  @Delete("redis/:key")
  async deleteKey(@Param("key") key: string) {
    return this.appService.deleteKey(key);
  }

}
