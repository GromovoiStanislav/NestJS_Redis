import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { StreamHandlerService } from "../redis/stream-handler.service";
import { EXAMPLE_STREAM_NAME } from "./constants";

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {

  private interval: NodeJS.Timeout = null;

  constructor(
    private readonly streamService: StreamHandlerService
  ) {
  }

  private populateStream() {
    this.interval = setInterval(() => {
      this.streamService.addToStream(
        {
          hello: 'world',
          date: new Date(),
          nestedObj: { num: Date.now() % 100 },
        },
        EXAMPLE_STREAM_NAME,
      );
    }, 1000);
  }

  async onModuleInit() {
    this.populateStream();
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }

  redisPing() {
    return this.streamService.ping();
  }

  public getSingleNewMessage() {
    return this.streamService.readFromStream(EXAMPLE_STREAM_NAME, 1);
  }

}
