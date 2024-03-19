import { IsEmail, IsString, Length, MinLength } from "class-validator";

export abstract class RegisterDto {
  @IsString()
  @IsEmail()
  @Length(7, 255)
  email: string;

  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(8, 40)
  password1: string;

  @IsString()
  @MinLength(1)
  password2: string;
}