import { ApiProperty } from '@nestjs/swagger';

class ValidationDetails {
  @ApiProperty({ example: ['Invalid status'] })
  status?: string[];

  @ApiProperty({ example: ['The createdBefore is not ISO-8601 format'] })
  createdBefore?: string[];

  @ApiProperty({ example: ['The createdAfter is not ISO-8601 format'] })
  createdAfter?: string[];

  @ApiProperty({ example: ['The project id is not valid'] })
  projectId?: string[];

  @ApiProperty({ example: ['The page must be an integer'] })
  page?: string[];

  @ApiProperty({ example: ['The limit must be at least 1'] })
  limit?: string[];

  @ApiProperty({ example: ['The sortOrder is invalid'] })
  sortOrder?: string[];
}

export class FindAllTasksValidationDto {
  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({ type: ValidationDetails })
  fails: ValidationDetails;
}
