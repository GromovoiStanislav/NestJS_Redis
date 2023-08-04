import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Schema, Repository, EntityId } from "redis-om";
// import { createClient } from "redis";
// import { ConfigService } from '@nestjs/config';
import { RedisService } from "../redis/redis.service";
import { RedisClient } from "../redis/redis-client.type";

export interface Task {
  id?: string;
  name: string;
  complete: boolean;
}


export const taskSchema = new Schema(
  'task',
  {
    name: {
      type: 'text',
    },
    complete: {
      type: 'boolean',
    },
  },
  {
    dataStructure: 'JSON',
  },
);


@Injectable()
export class TaskService implements OnModuleInit, OnModuleDestroy {

  private readonly taskRepository: Repository;
  private readonly client:RedisClient;

  constructor(
    //private configService: ConfigService,
    private readonly redisService: RedisService
    ) {
    // this.client = createClient({ url: configService.get<string>("REDIS_URL") || "redis://127.0.0.1:6379" });
    // this.client.connect()
    this.client = redisService.getClient()
    this.taskRepository = new Repository(taskSchema, this.client);
  }

  async onModuleInit() {
    await this.taskRepository.dropIndex();
    await this.taskRepository.createIndex();
  }

  onModuleDestroy(): any {
    //this.client.quit();
  }


  async createTask(data) {
    const task = await this.taskRepository.save(data);

    return {
      id: task[EntityId],
      ...task,
    } as Task;
  }


  async findTaskById(id: string) {
    const task = await this.taskRepository.fetch(id);

    return {
      id: task[EntityId],
      ...task,
    } as Task;
  }


  async findAllTasks() {
    const tasks = await this.taskRepository.search().return.all();

    return tasks.map((task) => ({
      id: task[EntityId],
      ...task,
    })) as Task[];
  }


  async findCompletedTasks() {
    const tasks = await this.taskRepository
      .search()
      .where('complete')
      .equals(true)
      .return.all();

    return tasks.map((task) => ({
      id: task[EntityId],
      ...task,
    })) as Task[];
  }


  async findUncompletedTasks() {
    const tasks = await this.taskRepository
      .search()
      .where('complete')
      .equals(false)
      .return.all();

    return tasks.map((task) => ({
      id: task[EntityId],
      ...task,
    })) as Task[];
  }


  async findUncompletedTasksByName(name: string) {
    const tasks = await this.taskRepository
      .search()
      .where('name')
      .matches(decodeURIComponent(name))
      // .and('complete')
      // .equals(false)
      .return.all();

    return tasks.map((task) => ({
      id: task[EntityId],
      ...task,
    })) as Task[];
  }


  async updateTask(id: string) {
    const task = await this.taskRepository.fetch(id);
    task.complete = !task.complete;
    const updatedTask = await this.taskRepository.save(task);

    return {
      id: updatedTask[EntityId],
      ...updatedTask,
    } as Task;
  }


  async deleteTask(id: string) {

    const exists = await this.client.exists(`task:${id}`);
    if (exists) {
      await this.taskRepository.remove(id);
      //await this.taskRepository.expire(id, 10*60) //10 min;
      return 'OK';
    } else {
      return 'Not found';
    }
  }

}
