import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from 'src/users/users.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ProjectResponseDto } from './dto/project-response.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    private readonly usersService: UsersService,
  ) {}

  async create(createProjectDto: CreateProjectDto, createdBy: string) {
    const createdProject = new this.projectModel({
      ...createProjectDto,
      createdBy,
    });
    return this.toResponseProject(
      await (await createdProject.save()).populate('createdBy'),
    );
  }

  async findAll({ page, count }: PaginationQueryDto) {
    const total = await this.projectModel.countDocuments().exec();
    const totalPages = Math.ceil(total / count);

    if (page > totalPages && total) {
      throw new NotFoundException('Page not found');
    }

    const projects = await this.projectModel
      .find()
      .skip((page - 1) * count)
      .limit(count)
      .populate('createdBy')
      .exec();

    return {
      total_pages: totalPages,
      total_projects: total,
      count,
      page,
      data: projects.map((project) => {
        return this.toResponseProject(project);
      }),
    };
  }

  async findOne(id: string) {
    const project = await this.projectModel
      .findById(id)
      .populate('createdBy')
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return this.toResponseProject(project);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .populate('createdBy')
      .exec();

    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return this.toResponseProject(updatedProject);
  }

  async remove(id: string) {
    const deletedProject = await this.projectModel
      .findByIdAndDelete(id)
      .populate('createdBy')
      .exec();
    if (!deletedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return this.toResponseProject(deletedProject);
  }

  toResponseProject(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdBy: this.usersService.toUserResponseDto(project.createdBy),
    };
  }
}
