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

@Controller('projects')
@UseFilters(new ValidationExeptionFilter('Validation failed'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.projectsService.create(createProjectDto, userId);
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.projectsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.projectsService.findOne(id);
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
