import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsOptional()
  assignedTo?: string[];
}
