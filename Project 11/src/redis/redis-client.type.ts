import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>;

export const REDIS_CLIENT = Symbol("REDIS_CLIENT");

export type RedisStreamMessage = Awaited<ReturnType<RedisClient["xRead"]>>[number]["messages"][number];

export type AsyncRedisStreamGenerator = AsyncGenerator<RedisStreamMessage, void, unknown>;