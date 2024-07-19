import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ObjectIdPattern } from 'src/common/common.constants';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'title:The title field is required' })
  title: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty({ message: 'project:The project field is required' })
  @Matches(ObjectIdPattern, {
    message: 'project:The project id is not valid',
  })
  project: string;

  @IsOptional()
  @Matches(ObjectIdPattern, {
    message: 'assignedTo:The assigner id is not valid',
  })
  assignedTo?: string;
}
