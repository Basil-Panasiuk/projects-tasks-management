import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'name:The name field is required' })
  name: string;

  @IsOptional()
  description?: string;
}
