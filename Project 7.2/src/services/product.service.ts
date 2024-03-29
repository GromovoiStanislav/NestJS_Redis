import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ProductInterface } from "../domain/product.interface";
import { RedisService } from "./redis.service";

// We will be using dummyjson product API to fetch our products data:
// This could be any API call or database operations
const productURL = "https://dummyjson.com/products/";

@Injectable()
export class ProductService {

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService
  ) {
  }

  async getProduct(productId: string): Promise<any> {
    // Check if the product exists in Redis
    const product = await this.redisService.getProduct(productId);
    if (product) {
      console.log("Cache hit!: Product found in Redis");
      return product;
    }

    const res = await fetch(`${productURL}${productId}`);

    if (res.ok) {
      const product: ProductInterface = await res.json();
      // Cache the data in Redis
      await this.redisService.saveProduct(`${product.id}`, product);
      console.log("Cache miss!: Product not found in Redis");
      return product;
    } else {
      throw new InternalServerErrorException("Something went wrong");
    }
  }
}