import { Controller, Get, Param } from "@nestjs/common";
import { ProductInterface } from "../domain/product.interface";
import { ProductService } from "../services/product.service";
import { GetProductDTO } from "./dto/product.request.dto";

@Controller("products")
export class ProductController {

  constructor(
    private readonly productService: ProductService
  ) {
  }

  @Get(":productId")
  async getProduct(@Param() param: GetProductDTO): Promise<{ data: ProductInterface }> {
    const data = await this.productService.getProduct(param.productId);
    return { data };
  }
}