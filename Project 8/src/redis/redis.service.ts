import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {

  private _logger = new Logger(RedisService.name);
  private redis: Redis;

  constructor(
    private readonly configService: ConfigService
  ) {
  }


  async onModuleInit() {
    //this.redis = new Redis(this.configService.get<string>("REDIS_URL") || 'redis://127.0.0.1:6379');
    this.redis = new Redis({
      host: this.configService.get<string>("REDIS_HOST") || "127.0.0.1",
      port: this.configService.get<number>("REDIS_PORT") || 6379,
      username: this.configService.get<string>("REDIS_USER") || undefined,
      password: this.configService.get<string>("REDIS_PASSWORD") || undefined
    });

    this.redis.on("connect", async () => {
      this._logger.debug(`connected to REDIS server`);
    });

    this.redis.on("error", (error) => {
      throw new Error(`cannot connect to redis ${JSON.stringify(error)}`);
    });

    this._logger.debug(`response from redis ping: ${await this.redis.ping()}`);
  }


  async onApplicationShutdown() {
    await this.redis.disconnect();
  }


  /**
   * It fetches all the keys from the Redis database that match the given pattern
   * @param {string} pattern - The pattern to match against.
   * @returns An array of strings
   */
  async getKeys(pattern: string): Promise<string[]> {
    this._logger.debug(`request to fetch keys for pattern: ${pattern}`);
    return await this.redis.keys(pattern).catch((e) => {
      this._logger.error(e, `error on getting keys`);
      throw new Error(e.message);
    });
  }


  /**
   * It deletes a key from the Redis database
   * @param {string} key - The key to be deleted
   * @returns The number of keys that were removed.
   */
  async deleteKey(key: string) {
    return await this.redis.del(key).catch((e) => {
      this._logger.error(e, `error on adding data to list`);
      throw new Error(e.message);
    });
  }


  /**
   * It takes a key and a value, and sets the value in the redis cache
   * @param {string} key - The key to set the value for.
   * @param {any} value - The value to set.
   */
  async setValues(key: string, value: any) {
    this._logger.debug(
      `request to set values for key: ${key} type of value is ${typeof value}`
    );

    switch (typeof value) {
      case "string":
      case "number":
        return await this.redis.set(key, value).catch((e) => {
          this._logger.error(e, `error on getting keys`);
          throw new Error(e.message);
        });
      default:
        return this.redis.set(key, JSON.stringify(value)).catch((e) => {
          this._logger.error(e, `error on getting keys`);
          throw new Error(e.message);
        });
    }
  }


  /**
   * It fetches the value of a key from the Redis database
   * @param {string} key - The key to fetch the value from.
   * @param {boolean} parse - boolean - if true, the data will be parsed to JSON.
   * @returns The value of the key in the redis database.
   */
  async getValue(key: string, parse: boolean) {
    this._logger.debug(`fetching data for key: ${key} and parse is: ${parse}`);

    /* Checking if the data is a string or an object. If it is a string, it will return the string. If it
    is an object, it will parse the data to JSON and return it. */
    if (parse) {
      const data = await this.redis.get(key).catch((e) => {
        this._logger.error(e, `error on getting values`);
        throw new Error(e.message);
      });
      if (data) return JSON.parse(data);
      else return null;
    } else
      return await this.redis.get(key).catch((e) => {
        this._logger.error(e, `error on getting values`);
        throw new Error(e.message);
      });
  }


  /**
   * It adds data to a list
   * @param {string} key - string - the key of the list
   * @param {string[]} data - string[] - the data to be added to the list
   * @returns The number of elements added to the list.
   */
  async lPushToList(key: string, data: string[]) {
    this._logger.debug(`adding ${data} to list`);
    return await this.redis.lpush(key, ...data).catch((e) => {
      this._logger.error(e, `error on adding data to list`);
      throw new Error(e.message);
    });
  }


  /**
   * It adds data to a list
   * @param {string} key - string - the key of the list
   * @param {string[]} data - string[] - the data to be added to the list
   * @returns The number of elements added to the list.
   */
  async rPushToList(key: string, data: string[]) {
    this._logger.debug(`adding ${data} to list`);
    return await this.redis.rpush(key, ...data).catch((e) => {
      this._logger.error(e, `error on adding data to list`);
      throw new Error(e.message);
    });
  }


  /**
   * It fetches a range of elements from a list
   * @param {string} key - The key of the list
   * @param {number} from - The starting index of the range.
   * @param {number} to - The index of the last element to get.
   */
  async getLrangeFromList(key: string, from: number, to: number) {
    return await this.redis.lrange(key, from, to).catch((e) => {
      this._logger.error(e, `error on fetching data from list`);
      throw new Error(e.message);
    });
  }


  /**
   * It adds data to a set
   * @param {string} key - string - the key of the set
   * @param {string[]} data - string[] - the data to be added to the set
   */
  async saddToSet(key: string, data: string[]) {
    this._logger.debug(`adding ${data} to set`);

    await this.redis.sadd(key, ...data).catch((e) => {
      this._logger.error(e, `error on adding data to set`);
      throw new Error(e.message);
    });
  }


  /**
   * It fetches all the members of a set from Redis
   * @param {string} key - string - The key of the set you want to fetch the members of.
   * @returns An array of members of the set.
   */
  async getMembersOfSet(key: string) {
    const result = await this.redis.smembers(key).catch((e) => {
      this._logger.error(e, `error on fetching members from set`);
      throw new Error(e.message);
    });
    return JSON.stringify(result);
  }


  /**
   * It removes members from a set
   * @param {string} key - The key of the set
   * @param {string[]} data - string[] - the data to be added to the set
   * @returns The number of members that were removed from the set, not including non existing members.
   */
  async removeMembersFromSet(key: string, data: string[]) {
    return await this.redis.srem(key, ...data).catch((e) => {
      this._logger.error(e, `error on removing members from set`);
      throw new Error(e.message);
    });
  }

}