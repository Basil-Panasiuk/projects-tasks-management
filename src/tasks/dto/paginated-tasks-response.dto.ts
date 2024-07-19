import { TaskResponseDto } from './task-response.dto';

export class PaginatedTasksResponseDto {
  total_pages: number;
  total_tasks: number;
  count: number;
  page: number;
  data: TaskResponseDto[];
}
