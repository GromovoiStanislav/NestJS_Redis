import { Injectable, NotFoundException } from "@nestjs/common";
import Redis from "ioredis";
import { randomUUID } from "node:crypto";
import { CreateUserDto } from "./create-user.dto";
import { UserDto } from "./user.dto";


@Injectable()
export class UsersService {

  private readonly client = new Redis(
    process.env.REDIS_URL || "redis://127.0.0.1:6379"
  );


  async getALLUsers() {
    const usersIds = await this.client.lrange("users", 0, -1);

    return await Promise.all(
      usersIds.map(async (id) => {
        return this.client.hgetall(`users:${id}`);
      })
    );
  }


  async findById(id: string): Promise<any> {
    const index = await this.client.lpos("users", id);
    if (index === null) {
      throw new NotFoundException("Not found");
    }

    return this.client.hgetall(`users:${id}`);
  }


  async create(data: CreateUserDto): Promise<any> {

    const user: UserDto = {
      id: randomUUID(),
      name: data.name,
      age: data.age
    };

    await this.client
      .multi()
      .hmset(`users:${user.id}`, user)
      .rpush("users", user.id)
      .exec();

    // return this.findById(user.id);
    return user.id;
  }


  async update(id: string, newValues: any): Promise<any> {
    const index = await this.client.lpos("users", id);
    if (index === null) {
      throw new NotFoundException("Not found");
    }

    const { name, age } = newValues;

    await this.client
      .multi()
      .hset(`users:${id}`, "name", name)
      .hset(`users:${id}`, "age", age)
      .exec();

    //return this.findById(id);
    return "OK";
  }


  async delete(id: string): Promise<any> {
    const index = await this.client.lpos("users", id);
    if (index === null) {
      throw new NotFoundException("Not found");
    }

    await this.client
      .multi()
      .lrem("users", 0, id)
      .del(`users:${id}`)
      .exec();

    return "OK";
  }

}
