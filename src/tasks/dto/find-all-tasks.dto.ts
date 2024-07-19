import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Matches,
  IsPositive,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { ObjectIdPattern } from 'src/common/common.constants';
import { Type } from 'class-transformer';
import { SortOrder } from 'src/common/enum/sort-order.enum';

export class FindAllTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'status:Invalid status' })
  status?: TaskStatus;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'createdBefore:The createdBefore is not ISO-8601 format' },
  )
  createdBefore?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'createdAfter:The createdAfter is not ISO-8601 format' },
  )
  createdAfter?: string;

  @IsOptional()
  @Matches(ObjectIdPattern, {
    message: 'projectId:The project id is not valid',
  })
  projectId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page:The page must be an integer' })
  @IsPositive({ message: 'page:The page must be at least 1.' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit:The limit must be an integer' })
  @IsPositive({ message: 'limit:The limit must be at least 1.' })
  limit: number = 5;

  @IsOptional()
  @IsEnum(SortOrder, { message: 'sortOrder:The sortOrder is invalid' })
  sortOrder?: SortOrder;
}
