import { ProjectResponseDto } from './project-response.dto';

export class PaginatedProjectsResponseDto {
  total_pages: number;
  total_projects: number;
  count: number;
  page: number;
  data: ProjectResponseDto[];
}
