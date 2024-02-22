import { Injectable } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Injectable()
export class StreamHandlerService {

  constructor(
    private readonly redisService: RedisService
  ) {
  }

  ping() {
    return this.redisService.ping();
  }


  public addToStream(fieldsToStore: Record<string, any>, streamName: string) {
    return this.redisService.addToStream({ fieldsToStore, streamName });
  }


  public readFromStream(streamName, count) {
    return this.redisService.readStream({
      streamName,
      blockMs: 0, // 0 = infinite blocking until at least one message is fetched, or timeout happens
      count, // max how many messages to fetch at a time
      lastMessageId: '$',
    });
  }


}
