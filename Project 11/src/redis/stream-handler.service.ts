import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { AsyncRedisStreamGenerator } from "./redis-client.type";

@Injectable()
export class StreamHandlerService  implements OnModuleDestroy {

  private isAlive = true;

  constructor(
    private readonly redisService: RedisService
  ) {
  }

  onModuleDestroy() {
    this.isAlive = false;
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


  public async *getStreamMessageGenerator(
    streamName: string,
    count: number,
  ): AsyncRedisStreamGenerator {
    // Start with latest data
    let lastMessageId = '$';
    while (this.isAlive) {
      const response = await this.redisService.readStream({
        streamName,
        blockMs: 0, // 0 = infinite blocking until at least one message is fetched, or timeout happens
        count, // max how many messages to fetch at a time
        lastMessageId,
      });

      // If no messages returned, continue to next iteration without yielding
      if (!response || response.length === 0) {
        continue;
      }
      // Update last message id to be the last message returned from redis
      lastMessageId = response[response.length - 1].id;
      for (const message of response) {
        yield message;
      }
    }
  }


}
