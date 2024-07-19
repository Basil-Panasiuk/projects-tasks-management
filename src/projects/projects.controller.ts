import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ValidationExeptionFilter } from 'src/common/filters/validation-exeption.filter';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiUnauthorizedResponseConfig } from 'src/iam/authentication/common/apiUnauthorizedResponse.config';
import { PaginationValidationErrorsDto } from 'src/common/dto/pagination-validation-errors.dto';
import { PaginatedProjectsResponseDto } from './dto/paginated-projects-response.dto';

@ApiTags('projects')
@ApiCookieAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  content: {
    'application/json': {
      examples: ApiUnauthorizedResponseConfig,
    },
  },
})
@Controller('projects')
@UseFilters(new ValidationExeptionFilter('Validation failed'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create project',
  })
  @ApiResponse({
    status: 422,
    description: 'Error: Unprocessable Entity',
    content: {
      'application/json': {
        example: {
          message: 'Validation failed',
          fails: {
            name: ['The name field is required'],
          },
        },
      },
    },
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.projectsService.create(createProjectDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginated projects',
  })
  @ApiResponse({
    status: 200,
    description: 'List of projects with pagination',
    type: PaginatedProjectsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not found',
    content: {
      'application/json': {
        example: { message: 'Page not found' },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Validation failed',
    type: PaginationValidationErrorsDto,
  })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.projectsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project',
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not found',
    content: {
      'application/json': {
        example: { message: 'Project with ID {id_value} not found' },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Error: Unprocessable Entity',
    content: {
      'application/json': {
        example: {
          message: 'Validation failed',
          fails: {
            id: ['The ID is not valid'],
          },
        },
      },
    },
  })
  findOne(@Param() idParamDto: IdParamDto) {
    return this.projectsService.findOne(idParamDto.id);
  }

  @Patch(':id')
  update(
    @Param() { id }: IdParamDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdParamDto) {
    return this.projectsService.remove(id);
  }
}
