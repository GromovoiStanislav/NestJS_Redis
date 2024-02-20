import { Inject, Injectable } from "@nestjs/common";
import { ResetTokenInterface } from "../domain/reset.token.interface";
import { RedisService } from "./redis.service";
import { randomUUID } from "node:crypto";

@Injectable()
export class PasswordService {

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService
  ) {
  }

  async generateResetToken(userId: string): Promise<ResetTokenInterface> {
    //NOTE Check if the user exists in the database
    //Generate a random number token with the length of 6
    const token = randomUUID();
    await this.redisService.saveResetToken(userId, token);
    return { token };
  }

  async getTokenUserId(token: string): Promise<string | null> {
    return await this.redisService.getResetToken(token);
  }

}