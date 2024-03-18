import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { EntityId, Repository } from "redis-om";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { RedisClientService } from "../redis-client/redis-client.service";
import { Todo, todoSchema } from "./entities/todo.entity";


@Injectable()
export class TodosService implements OnModuleInit {

  private readonly todosRepository: Repository;

  constructor(private readonly redisClient: RedisClientService) {
    this.todosRepository = new Repository(todoSchema, redisClient.getClient());
    (async () => {
      await this.todosRepository.createIndex();
    })();
  }

  async onModuleInit() {
    // This could go to the constructor
    //await this.todosRepository.createIndex();
  }

  public async create(userId: string, { body }: CreateTodoDto): Promise<Todo> {

    const todo = new Todo;
    todo.body = body;
    todo.completed = false;
    todo.createdAt = new Date();
    todo.author = userId;

    await this.todosRepository.save({ ...todo });

    return todo;
  }

  public async findAll(userId: string, completed?: boolean): Promise<Todo[]> {
    const qb = this.todosRepository.search().where("author").equals(userId);

    if (completed !== null) {
      qb.where("completed").equals(completed);
    }

    return (await qb.return.all()).map((todo) => ({
      id: todo[EntityId],
      ...todo
    })) as Todo[];
  }

  public async findOne(userId: string, todoId: string): Promise<Todo> {
    const todo = await this.todosRepository.fetch(todoId);

    if (!todo || todo.author !== userId)
      throw new NotFoundException("Todo not found");

    // @ts-ignore
    return {
      id: todo[EntityId],
      ...todo
    };
  }


  public async update(
    userId: string,
    todoId: string,
    { body, completed }: UpdateTodoDto,
  ): Promise<Todo> {

    const todo = await this.todosRepository.fetch(todoId);

    if (!todo || todo.author !== userId)
      throw new NotFoundException("Todo not found");

    if (body && todo.body !== body) {
      todo.body = body;
    }

    if (completed) {
      const boolComplete = completed.toLowerCase() === 'true';
      if (todo.completed !== boolComplete) {
        todo.completed = boolComplete;
      }
    }

    await this.todosRepository.save({ ...todo });

    // @ts-ignore
    return {
      id: todo[EntityId],
      ...todo
    };

  }


  public async remove(userId: string, todoId: string): Promise<string> {
    const todo = await this.findOne(userId, todoId);
    await this.todosRepository.remove(todo[EntityId]);
    return 'Todo removed successfully';
  }

}
