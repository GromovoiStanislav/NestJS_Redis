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