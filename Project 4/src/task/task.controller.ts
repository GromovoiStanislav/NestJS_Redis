import { Controller, Get, Post, Body, Param, Put, Delete } from "@nestjs/common";
import { TaskService } from "./task.service";


@Controller("tasks")
export class TaskController {

  constructor(
    private readonly taskService: TaskService
  ) {
  }


  @Get()
  async findAllTasks() {
    return this.taskService.findAllTasks();
  }


  @Get("completed")
  async findCompletedTasks() {
    return this.taskService.findCompletedTasks();
  }


  @Get("uncompleted")
  async findUncompletedTasks() {
    return this.taskService.findUncompletedTasks();
  }

  @Get("name/:name")
  async findUncompletedTasksByName(@Param("name") name: string) {
    return this.taskService.findUncompletedTasksByName(name);
  }


  @Get(":id")
  async findTaskById(@Param("id") id: string) {
    return this.taskService.findTaskById(id);
  }


  @Post()
  async createTask(@Body() data) {
    const task = {
      name: data.name,
      complete: false
    };
    return this.taskService.createTask(task);
  }


  @Put(":id")
  async updateTask(
    @Param("id") id: string) {
    return this.taskService.updateTask(id);
  }


  @Delete(":id")
  async deleteTask(@Param("id") id: string) {
    return this.taskService.deleteTask(id);
  }

}
