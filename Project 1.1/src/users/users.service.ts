import {Injectable, NotFoundException, OnModuleInit} from "@nestjs/common";
import {createClient} from "redis";
import {randomUUID} from "node:crypto";
import {CreateUserDto} from "./dto/create-user.dto";


@Injectable()
export class UsersService implements OnModuleInit {

    private readonly client = createClient({url: process.env.REDIS_URL || "redis://127.0.0.1:6379"});

    constructor() {
        //this.client.connect();
    }


    async onModuleInit() {
        await this.client.connect();
    }


    async getALLUsers() {
        // @ts-ignore
        const usersIds = await this.client.lRange("users", 0, -1);

        return await Promise.all(
            usersIds.map(async (id) => {
                // @ts-ignore
                return this.client.hGetAll(`users:${id}`);
            })
        );
    }


    async findById(id: string): Promise<any> {
        // @ts-ignore
        const index = await this.client.lPos("users", id);
        if (index === null) {
            throw new NotFoundException("Not found");
        }

        // @ts-ignore
        return this.client.hGetAll(`users:${id}`);
    }


    async create(data: CreateUserDto): Promise<any> {
        // await this.saveObjectToRedis(user.id, user)
        //   .catch((err) => {
        //     console.error("Error saving object in Redis:", err);
        //   });

        const user = {
            id: randomUUID(),
            name: data.name,
            age: data.age
        };

        // @ts-ignore
        await this.client
            .multi()
            .hSet(`users:${user.id}`, user)
            .rPush("users", user.id)
            .exec();

        // return this.findById(user.id);
        return user.id;
    }


    async update(id: string, newValues: any): Promise<any> {
        // await this.saveObjectToRedis(id, newValues)
        //     .catch((err) => {
        //         console.error("Error saving object in Redis:", err);
        //     });

        // @ts-ignore
        const index = await this.client.lPos("users", id);
        if (index === null) {
            throw new NotFoundException("Not found");
        }

        const {name, age} = newValues;
        // @ts-ignore
        await this.client
            .multi()
            .hSet(`users:${id}`, "name", name)
            .hSet(`users:${id}`, "age", age)
            .exec();

        //return this.findById(id);
        return "OK";
    }


    async delete(id: string): Promise<any> {
        // @ts-ignore
        const index = await this.client.lPos("users", id);
        if (index === null) {
            throw new NotFoundException("Not found");
        }

        await this.client
            .multi()
            .lRem("users", 0, id)
            .del(`users:${id}`)
            .exec();

        return "OK";
    }


    ///////////////////////////////////////////////////
    private async saveObjectToRedis(id, data) {
        const entries = Object.entries(data);
        for await (const [field, value] of entries) {
            // @ts-ignore
            await this.client.hSet(`${id}`, field, value);
        }
    }


}
