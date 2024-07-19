import { ProjectResponseDto } from 'src/projects/dto/project-response.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class TaskResponseDto {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  @ApiProperty({ type: PickType(ProjectResponseDto, ['id', 'name']) })
  project: Pick<ProjectResponseDto, 'id' | 'name'>;
  createdBy: UserResponseDto;
  assignedTo?: UserResponseDto;
}
