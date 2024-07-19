import {
  Controller,
  Get,
  Post,
  Body,
  // Param,
  // Patch,
  // Delete,
  UseFilters,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ValidationExeptionFilter } from 'src/common/filters/validation-exeption.filter';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiUnauthorizedResponseConfig } from 'src/iam/authentication/common/apiUnauthorizedResponse.config';
import { PaginatedTransactionsResponseDto } from './dto/paginated-tasks-response.dto';
import { FindAllTasksValidationDto } from './dto/find-all-tasks-validation.dto';

@ApiTags('tasks')
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
@Controller('tasks')
@UseFilters(new ValidationExeptionFilter('Validation failed'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiResponse({
    status: 422,
    description: 'Error: Unprocessable Entity',
    content: {
      'application/json': {
        example: {
          message: 'Validation failed',
          fails: {
            title: ['The title field is required'],
            project: ['The project id is not valid'],
            assignedTo: ['The assigner with provided id is not found'],
          },
        },
      },
    },
  })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of transactions with pagination',
    type: PaginatedTransactionsResponseDto,
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
    type: FindAllTasksValidationDto,
  })
  findAll(@Query() query: FindAllTasksDto) {
    return this.tasksService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tasksService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.tasksService.update(id, updateTaskDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(id);
  // }
}
