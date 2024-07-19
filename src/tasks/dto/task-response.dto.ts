import { ProjectResponseDto } from 'src/projects/dto/project-response.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class TaskResponseDto {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: Pick<ProjectResponseDto, 'id' | 'name'>;
  createdBy: UserResponseDto;
  assignedTo?: UserResponseDto;
}
