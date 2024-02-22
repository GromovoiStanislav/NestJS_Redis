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
    // Populating Redis with messages
    this.populateStream();
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }

  public redisPing() {
    return this.streamService.ping();
  }

  public getSingleNewMessage() {
    return this.streamService.readFromStream(EXAMPLE_STREAM_NAME, 1);
  }

  public async getMultipleNewMessages(count: number) {
    const generator = this.streamService.getStreamMessageGenerator(
      EXAMPLE_STREAM_NAME,
      count,
    );
    const messages: Record<string, string>[] = [];
    let counter = 0;
    for await (const messageObj of generator) {
      messages.push(this.parseMessage(messageObj.message));
      counter++;
      if (counter >= count) {
        break;
      }
    }
    return messages;
  }

  private parseMessage(message: Record<string, string>) {
    return Object.entries(message).reduce((acc, [key, value]) => {
      try{
        acc[key] = JSON.parse(value);
      }catch(e){
        acc[key] =value
      }
      return acc;
    }, {});
  }

}
