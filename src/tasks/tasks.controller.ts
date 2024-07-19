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

@Controller('tasks')
@UseFilters(new ValidationExeptionFilter('Validation failed'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
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
