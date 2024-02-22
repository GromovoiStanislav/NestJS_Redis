import { Injectable } from "@nestjs/common";
import { HttpclientService } from "../httpclient/httpclient.service";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class CommentsService {

  constructor(
    private http: HttpclientService,
    private cache: RedisService
  ) {
  }

  async getPostComments(postId: number, skip: number, take: number) {
    const key = `CommentsService:comments:post:${postId}`;

    const cached = await this.cache.readListFromCache(
      key,
      skip,
      take + skip - 1
    );
    if (cached && cached.length > 0) {
      console.log("cache found");
      return cached.map((element) => JSON.parse(element));
    } else {
      console.log("cache missed");
      const data = await this.http.getPostComments(postId);
      await this.cache.cacheList(key, data, 600);
      console.log("cached success");
      return data;
    }
  }
}
