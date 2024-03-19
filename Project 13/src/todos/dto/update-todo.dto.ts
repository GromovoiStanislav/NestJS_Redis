import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @Length(1, 300)
  @IsOptional()
  body?: string;

  @IsString()
  @IsIn(['true', 'false', 'True', 'False'])
  @IsOptional()
  completed?: string;
}