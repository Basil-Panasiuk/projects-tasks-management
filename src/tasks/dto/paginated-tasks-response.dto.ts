import { TaskResponseDto } from './task-response.dto';

export class PaginatedTransactionsResponseDto {
  total_pages: number;
  total_tasks: number;
  count: number;
  page: number;
  data: TaskResponseDto[];
}
