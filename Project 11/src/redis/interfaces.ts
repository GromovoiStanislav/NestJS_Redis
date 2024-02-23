export interface AddToStreamParams {
  fieldsToStore: Record<string, any>;
  streamName: string;
}

export interface ReadStreamParams {
  streamName: string;
  blockMs: number;
  count: number;
  lastMessageId: string;
}

export interface StreamParamsBase {
  /** Name of stream to read from */
  streamName: string;
  /** Max time in ms for how long to block Redis connection before returning
   * If 0 is passed, it will block until at least one message is fetched, or timeout happens
   * */
  blockMs: number;
  /** Max how many messages to fetch at a time from Redis */
  count: number;
}

export interface ReadStreamParams extends StreamParamsBase {
  /** ID of last fetched message */
  lastMessageId: string;
}

export interface CosnumeStreamParams extends StreamParamsBase {
  /** Name of consumer group */
  group: string;
  /** Name of consumer, must be unique within group */
  consumer: string;
}

export interface AcknowledgeMessageParams {
  /** Name of stream to acknowledge message in */
  streamName: string;
  /** Name of consumer group */
  group: string;
  /** ID of messages to acknowledge */
  messageIds: string[];
}

export interface AutoclaimMessageParams {
  streamName: string;
  group: string;
  consumer: string;
  minIdleTimeMs: number;
  count: number;
}

export interface ReadConsumerGroupParams {
  streamName: string;
  group: string;
  consumer: string;
  count: number;
  autoClaimMinIdleTimeMs?: number;
  autoAck?: boolean;
}