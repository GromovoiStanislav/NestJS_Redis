import { IsString, Length } from "class-validator";

export abstract class PasswordDto {
  @IsString()
  @Length(1, 40)
  password: string;
}