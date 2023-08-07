import { Controller, Get, Post } from "@nestjs/common";
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


  @Post("products")
  async createProduct() {
    const id = Math.floor(Math.random() * 10 + 1);
    const product = {
      id,
      name: `Product ${id}`
    };

    await this.appService.createProduct(product);
    return product
  }

}
