import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req
} from "@nestjs/common";
import { Request } from "express";
import * as rawbody from "raw-body";
import { RedisService } from "./redis.service";


@Controller()
export class RedisController {

  constructor(
    private _redis: RedisService
  ) {
  }


  @Get("keys/:pattern")
  /**
   * It takes a pattern as a parameter, and returns the keys that match that pattern
   * @param {string} key - The key to get the value of.
   * @returns The keys that match the pattern
   */
  async getKeys(
    @Param("pattern"
    ) key: string) {
    return await this._redis.getKeys(key).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }


  @Delete("keys/:key")
  /**
   * It takes a key as a parameter, and then calls the deleteKey function in the RedisService
   * @param {string} key - The key to delete
   * @returns The result of the deleteKey function.
   */
  async deleteKey(
    @Param("key"
    ) key: string) {
    return await this._redis.deleteKey(key).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }


  @Get("values/:key")
  /**
   * The function takes a key and a parse parameter. If parse is true, it will return the value of the
   * key as a JSON object. If parse is false, it will return the value of the key as a string
   * @param {string} key - The key to get the value for.
   * @param {boolean} parse - boolean - This is a query parameter that is optional. If it is not
   * provided, the default value is false.
   * @returns The value of the key.
   */
  async getValue(
    @Param("key") key: string,
    @Query("parse") parse: boolean
  ) {
    if (typeof parse == "string") parse = "true" === parse;
    if (parse) {
      return await this._redis.getValue(key, true).catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    } else {
      return await this._redis.getValue(key, false).catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
    }
  }


  @Post("values/:key")
  /**
   * It takes a key and a payload, and sets the value of the key to the payload
   * @param {string} key - The key to set the value to.
   * @param {string} payload - This is the body of the request.
   * @param {Request} req - Request - This is the request object that is passed to the controller.
   * @returns The value of the key
   */
  async setValue(
    @Param("key") key: string,
    @Body() payload: string,
    @Req() req: Request
  ) {
    let processedPayload: any;
    if (req.readable) {
      const buffer: Buffer = await rawbody(req);
      processedPayload = buffer.toString();
    } else {
      processedPayload = payload;
    }
    return await this._redis.setValues(key, processedPayload).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }


  @Post("values/lists/lpush/:key")
  /**
   * "This function takes a key and a payload, and pushes the payload to the list at the key."
   * lpush used in URL since there are two ways to add values to list
   * The @Param() decorator is used to get the key from the URL. The @Body() decorator is used to get the
   * payload from the request body
   * @param {string} key - The key of the list you want to push to.
   * @param payload - [string]
   * @returns The number of elements in the list after the push operation.
   */
  async lPushToList(
    @Param("key") key: string,
    @Body() payload: [string]
  ) {
    return await this._redis.lPushToList(key, payload).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }


  @Post("values/lists/rpush/:key")
  /**
   * "This function takes a key and a payload, and pushes the payload to the list at the key."
   * rpush used in URL since there are two ways to add values to list
   * The @Param() decorator is used to get the key from the URL. The @Body() decorator is used to get the
   * payload from the request body
   * @param {string} key - The key of the list you want to push to.
   * @param payload - [string]
   * @returns The number of elements in the list after the push operation.
   */
  async rPushToList(
    @Param("key") key: string,
    @Body() payload: [string]
  ) {
    return await this._redis.rPushToList(key, payload).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }


  @Get("values/lists/lrange/:key")
  /**
   * It gets a range of values from a list stored in Redis
   * @param {string} key - The key of the list you want to get the range from.
   * @param {number} from - The starting index of the range.
   * @param {number} to - number,
   * @returns The list of values from the redis list.
   */
  async getLrangeFromList(
    @Param("key") key: string,
    @Query("from") from: number,
    @Query("to") to: number
  ) {
    return await this._redis.getLrangeFromList(key, from, to).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }


  @Post("values/sets/:key")
  /**
   * It adds members to a set
   * @param {string} key - The key of the set you want to add members to.
   * @param payload - [string]
   * @returns The number of members added to the set.
   */
  async addMembersToSet(
    @Param("key") key: string,
    @Body() payload: [string]
  ) {
    return await this._redis.saddToSet(key, payload).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }


  @Get("values/sets/members/:key")
  /**
   * It returns the members of a set stored in Redis
   * @param {string} key - The key of the set you want to get the members of.
   * @returns The members of the set.
   */
  async getMembersOfSet(@Param("key") key: string) {
    return await this._redis.getMembersOfSet(key).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }


  @Delete("values/sets/:key")
  /**
   * It removes members from a set
   * @param {string} key - The key of the set you want to remove members from.
   * @param payload - [string]
   * @returns The number of members that were removed from the set, not including non existing members.
   */
  async removeMembersFromSet(
    @Param("key") key: string,
    @Body() payload: [string]
  ) {
    return await this._redis.removeMembersFromSet(key, payload).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }

}