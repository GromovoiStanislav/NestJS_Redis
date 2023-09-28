import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./create-user.dto";


@Controller("users")
export class UsersController {

  constructor(
    private readonly usersServices: UsersService
  ) {
  }


  @Get()
  async getALLUsers() {
    return this.usersServices.getALLUsers();
  }


  @Get(":id")
  async getUser(@Param("id") id) {
    return this.usersServices.findById(id);
  }


  @Post()
  async createUser(@Body() createUsersDTO: CreateUserDto) {
    return this.usersServices.create(createUsersDTO);
  }


  @Put(":id")
  async updateUser(@Param("id") id, @Body() body) {
    return this.usersServices.update(id, body);
  }


  @Delete(":id")
  async deleteUser(@Param("id") id) {
    return this.usersServices.delete(id);
  }

}
