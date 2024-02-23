import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { StreamHandlerService } from "../redis/stream-handler.service";
import { EXAMPLE_STREAM_NAME } from "./constants";

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {

  private isAlive = true;
  private interval: NodeJS.Timeout = null;

  constructor(
    private readonly streamService: StreamHandlerService
  ) {
  }


  private async continuousReadMessages() {
    const generator = this.streamService.getStreamMessageGenerator(
      EXAMPLE_STREAM_NAME,
      3
    );
    for await (const messageObj of generator) {
      console.log(
        `Got message with ID: ${messageObj.id}`,
        JSON.stringify(this.parseMessage(messageObj.message), undefined, 2)
      );
      if (!this.isAlive) {
        break;
      }
    }
  }


  private populateStream() {
    this.interval = setInterval(() => {
      this.streamService.addToStream(
        {
          hello: "world",
          date: new Date(),
          nestedObj: { num: Date.now() % 100 }
        },
        EXAMPLE_STREAM_NAME
      );
    }, 1000);
  }


  async onModuleInit() {
    this.continuousReadMessages();

    // Populating Redis with messages
    this.populateStream();
  }


  onModuleDestroy() {
    clearInterval(this.interval);
    this.isAlive = false;
  }


  public redisPing() {
    return this.streamService.ping();
  }


  public async getSingleNewMessage() {
    //return this.streamService.readFromStream(EXAMPLE_STREAM_NAME, 1);

    const generator = this.streamService.getStreamMessageGenerator(
      EXAMPLE_STREAM_NAME,
      1
    );
    const messageObj = await generator.next();
    if (!messageObj.done && messageObj.value) {
      return this.parseMessage(messageObj.value.message);
    }
  }


  public async getMultipleNewMessages(count: number) {
    const generator = this.streamService.getStreamMessageGenerator(
      EXAMPLE_STREAM_NAME,
      count
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
      try {
        acc[key] = JSON.parse(value);
      } catch (e) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }


  public async consumeMessageFromGroup(
    group: string,
    consumer: string,
    count: number
  ) {
    const generator = this.streamService.getConsumerMessageGenerator({
      streamName: EXAMPLE_STREAM_NAME,
      group,
      consumer,
      count
    });
    const messages: Record<string, string>[] = [];
    let counter = 0;
    for await (const messageObj of generator) {
      messages.push(this.parseMessage(messageObj.message));
      counter++;
      if (counter >= count) {
        break;
      }
    }
    return {
      group,
      consumer,
      messages
    };
  }

}
