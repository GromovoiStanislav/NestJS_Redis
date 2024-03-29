import { Injectable } from "@nestjs/common";
import { groupBy } from "lodash";
import { HttpclientService } from "src/httpclient/httpclient.service";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class OrderService {

  constructor(
    private http: HttpclientService,
    private cache: RedisService
  ) {
  }

  public async getAllOrders(category: string, skip: number, take: number) {
    const key = `OrderService:orders:group:${category}`;

    const cached = await this.cache.readListFromCache(key, skip, take + skip - 1);
    if (cached && cached.length > 0) {
      console.log("cache found");
      return cached.map((element) => JSON.parse(element));
    } else {
      console.log("cache missed");
      const data = await this.http.getAllOreders();
      const groupedData = this.groupData(data);
      await this.cache.cacheList(key, groupedData, 600);
      console.log("cached success");
      return groupedData;
    }
  }

  private groupData(orders: any[]) {

    const groupedOrders = [].concat(
      [],
      ...orders
        .map((order) =>
          groupBy(
            order["orderLines"],
            (orderLine) =>
              `${orderLine.orderNumber}||${orderLine.storeLocation}||${orderLine.deliveryLocation?.name}||${orderLine.item.mode.config.name}`
          )
        )
        .map((order) =>
          Object.keys(order).map((key) => ({ key, data: order[key] }))
        )
    );
    return groupedOrders;
  }

}
