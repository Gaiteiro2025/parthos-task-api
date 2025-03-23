import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDate } from 'util/types';
import { TaskHistoryAction } from '../common/enums/task-history-action.enum';
import { TaskPriority } from '../common/enums/task-priority.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { TaskType } from '../common/enums/task-type.enum';
import { handleError } from '../common/handle.error';
import { TaskChange } from '../common/TaskChange';
import { TaskHistoryService } from '../task-history/task-history.service';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(TaskHistoryService)
    private readonly taskHistoryService: TaskHistoryService
  ) { }

  async findByUserId(assignId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({ where: { assign: { id: assignId } } });
    if (!tasks || tasks.length === 0) {
      return [];
    }
    return tasks;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const assignUser = await this.findAssignUserById(createTaskDto.assign);

      const task = this.taskRepository.create({
        ...createTaskDto,
        assign: assignUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedTask = await this.taskRepository.save(task);

      await this.taskHistoryService.createHistory({
        task: savedTask,
        changedBy: assignUser,
        action: TaskHistoryAction.CREATED,
        createdAt: new Date(),
      });

      return savedTask;
    } catch (error) {
      handleError(error, 'criar tarefa');
    }
  }

  async findOne(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id }, relations: ['assign'] });

      if (!task) {
        throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
      }

      return task;
    } catch (error) {
      handleError(error, 'buscar a tarefa', id);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.findOne(id);
      const changes: TaskChange[] = this.detectChanges(task, updateTaskDto);
      await this.updateAssign(updateTaskDto, task, changes);

      if (changes.length === 0) return task;
      //task.updatedAt = new Date();
      const updatedTask = await this.taskRepository.save(task);
      await this.taskHistoryService.createHistoryByTaskUpdate(updatedTask, task.assign, changes);

      return updatedTask;
    } catch (error) {
      handleError(error, 'atualizar a tarefa', id);
    }
  }

  async remove(id: string): Promise<Task> {
    try {
      const task = await this.findOne(id);

      await this.taskHistoryService.createHistory({
        task,
        changedBy: task.assign,
        action: TaskHistoryAction.DELETED,
        createdAt: new Date(),
      });

      return await this.taskRepository.remove(task);
    } catch (error) {
      handleError(error, 'remover a tarefa', id);
    }
  }

  async findAssignUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }
      return user;
    } catch (error) {
      handleError(error, 'buscar o usuário', id);
    }
  }

  private async updateAssign(updateTaskDto: UpdateTaskDto, task: Task, changes: TaskChange[]): Promise<void> {
    if (updateTaskDto.assign === undefined || task.assign.id === updateTaskDto.assign) return;
    const assignUser = await this.findAssignUserById(updateTaskDto.assign);
    changes.push({ fieldChanged: 'assign', oldValue: task.assign.id, newValue: updateTaskDto.assign.toString() });
    task.assign = assignUser;

  }

  private detectChanges(task: Task, updateTaskDto: UpdateTaskDto): TaskChange[] {
    const changes: TaskChange[] = [];

    Object.entries(updateTaskDto).forEach(([keyTask, value]) => {
      const key = keyTask as keyof UpdateTaskDto;
      const newValue = value as UpdateTaskDto[keyof UpdateTaskDto];
      let oldValue = task[key] as Task[keyof UpdateTaskDto] || '';

      if (key === 'assign' || oldValue instanceof User) return;
      if (isDate(oldValue)) oldValue = oldValue.toISOString();

      if (newValue !== undefined && oldValue !== newValue) {
        changes.push({ fieldChanged: key, oldValue: oldValue, newValue: newValue.toString() });

        if (key === 'status') {
          task[key] = newValue as TaskStatus;

          if (newValue === TaskStatus.DONE && !task.completedAt) {
            task.completedAt = new Date();
          } else if (newValue !== TaskStatus.DONE) {
            task.completedAt = null;
          }
        } else if (key === 'completedAt' || key === 'dueDate') {
          task[key] = new Date(newValue);
        } else if (key === 'priority') {
          task[key] = newValue as TaskPriority;
        } else if (key === 'type') {
          task[key] = newValue as TaskType;
        } else {
          task[key] = newValue;
        }
      }
    });

    return changes;
  }
}
