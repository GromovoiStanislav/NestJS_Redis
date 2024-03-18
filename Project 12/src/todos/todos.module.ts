import { Module } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosController } from "./todos.controller";
import { RedisClientModule } from "../redis-client/redis-client.module";

@Module({
  imports: [RedisClientModule],
  controllers: [TodosController],
  providers: [TodosService]
})
export class TodosModule {
}
