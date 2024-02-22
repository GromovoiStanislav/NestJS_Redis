import { Controller, Get, Param, Query } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {

  constructor(
    private orderService: OrderService
  ) {
  }

  @Get(":category")
  async fetchOrders(
    @Param("category") category: string,
    @Query("skip") skip: string,
    @Query("take") take: string
  ) {
    return await this.orderService.getAllOrders(
      category,
      parseInt(skip),
      parseInt(take)
    );
  }
}
