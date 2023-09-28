import { Injectable, OnModuleInit } from "@nestjs/common";
import { createClient } from "redis";
import {CreateUserDto} from "./create-user.dto";


@Injectable()
export class UsersService implements OnModuleInit {

  private readonly client = createClient({ url: "redis://127.0.0.1:6379" });

  constructor() {
    //this.client.connect();
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async getALLUsers() {
    const users = [];
    // for await (const key of this.client.scanIterator()) {
    //   if (await this.client.type(key) === "hash") {
    //     users.push(await this.client.hGetAll(key));
    //   }
    // }
    return users;
  }

  async findById(id): Promise<any> {
    return this.client.hGetAll(id);
  }

  async create(user: CreateUserDto): Promise<any> {
    // @ts-ignore
    await this.client.hSet(`user:${user.id}`, user)
    // await this.saveObjectToRedis(user.id, user)
    //   .catch((err) => {
    //     console.error("Error saving object in Redis:", err);
    //   });
    return this.findById(`user:${user.id}`);
  }

  async update(id: number, newValues: any): Promise<any> {
    // return this.client.hSet(`${id}`, newValues);
    await this.saveObjectToRedis(id, newValues)
      .catch((err) => {
        console.error("Error saving object in Redis:", err);
      });
    return this.findById(id);
  }


  async delete(id: number): Promise<any> {
    // @ts-ignore
    return this.client.del(`user:${id}`);
  }


  private async saveObjectToRedis(id, data) {
    const entries = Object.entries(data);
    for await (const [field, value] of entries) {
      // @ts-ignore
      await this.client.hSet(`${id}`, field, value);
    }
  }

  private async saveObjectToRedis2(id, data) {
    const entries = Object.entries(data);
    for (const [field, value] of entries) {
      await new Promise((resolve, reject) => {
        try {
          // @ts-ignore
          this.client.hSet(`${id}`, field, value);
          resolve("OK");
        } catch (err) {
          reject(err);
        }
      });
    }
  }


}
