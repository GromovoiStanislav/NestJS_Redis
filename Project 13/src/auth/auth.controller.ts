import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { RegisterDto } from "./dto/register.dto";
import { IAccessToken } from "./interfaces/access-token.interface";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";
import { IUserResponse } from "./interfaces/user-response.interface";
import { PasswordDto } from "./dto/password.dto";
import { IMessage } from "./interfaces/message.interface";

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}


  @Public()
  @Post('register')
  public async register(@Body() dto: RegisterDto): Promise<IAccessToken> {
    return {
      token: await this.authService.registerUser(dto),
    };
  }


  @Public()
  @Post('login')
  public async login(@Body() dto: LoginDto): Promise<IAccessToken> {
    return {
      token: await this.authService.login(dto),
    };
  }


  @Get('account')
  public async findAccount(
    @CurrentUser() userId: string,
  ): Promise<IUserResponse> {
    const { name, email, id, createdAt } = await this.authService.userById(userId);

    return {
      name,
      email,
      createdAt,
      id,
    };
  }


  @Delete('account')
  public async deleteAccount(
    @CurrentUser() userId: string,
    @Body() dto: PasswordDto,
  ): Promise<IMessage> {
    return {
      message: await this.authService.remove(userId, dto.password),
    };
  }

}
