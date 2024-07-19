import {
  BadRequestException,
  Injectable,
  NotFoundException,
  // NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { ProjectsService } from 'src/projects/projects.service';
import { TaskResponseDto } from './dto/task-response.dto';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, createdBy: string) {
    await this.checkProject(createTaskDto.project);
    if (createTaskDto.assignedTo) {
      await this.checkAssigner(createTaskDto.assignedTo);
    }
    const createdTask = new this.taskModel({ ...createTaskDto, createdBy });
    const savedTask = await createdTask.save();
    return this.toResponseTask(
      await savedTask.populate(['project', 'createdBy', 'assignedTo']),
    );
  }

  async findAll(query: FindAllTasksDto) {
    const {
      status,
      createdBefore,
      createdAfter,
      projectId,
      page,
      limit,
      sortOrder,
    } = query;

    const filter: any = {};
    if (status) filter.status = status;
    if (createdBefore) filter.createdAt = { $lt: new Date(createdBefore) };
    if (createdAfter) filter.createdAt = { $gte: new Date(createdAfter) };
    if (projectId) filter.projectId = projectId;

    const total = await this.taskModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total) {
      throw new NotFoundException('Page not found');
    }

    const tasks = await this.taskModel
      .find(filter)
      .populate(['project', 'createdBy', 'assignedTo'])
      .sort({ createdAt: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      total_pages: totalPages,
      total_tasks: total,
      count: tasks.length,
      page,
      data: tasks.map((task) => this.toResponseTask(task)),
    };
  }

  // async findOne(id: string) {
  //   const task = await this.taskModel
  //     .findById(id)
  //     .populate('project')
  //     .populate('createdBy')
  //     .populate('assignedTo')
  //     .exec();
  //   if (!task) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   }
  //   return task;
  // }

  // async update(id: string, updateTaskDto: UpdateTaskDto) {
  //   const updatedTask = await this.taskModel
  //     .findByIdAndUpdate(id, updateTaskDto, { new: true })
  //     .exec();
  //   if (!updatedTask) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   }
  //   return updatedTask;
  // }

  // async remove(id: string) {
  //   const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
  //   if (!deletedTask) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   }
  //   return deletedTask;
  // }

  async checkAssigner(id: string) {
    const assignedUser = await this.usersService.findOne(id);

    if (!assignedUser) {
      throw new BadRequestException({
        message: ['assignedTo:The assigner with provided id is not found'],
      });
    }
  }

  async checkProject(id: string) {
    const project = await this.projectsService.checkPersists(id);

    if (!project) {
      throw new BadRequestException({
        message: ['project:The project with provided id is not found'],
      });
    }
  }

  toResponseTask(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      project: {
        id: task.project.id,
        name: task.project.name,
      },
      createdBy: this.usersService.toUserResponseDto(task.createdBy),
      assignedTo:
        task.assignedTo && this.usersService.toUserResponseDto(task.assignedTo),
    };
  }
}
