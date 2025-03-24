import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskPriority } from '../common/enums/task-priority.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { TaskType } from '../common/enums/task-type.enum';
import { mockTask } from '../common/mocks/task.mock';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

jest.mock('../auth/guards/jwt-auth.guard');

describe('TaskController', () => {
  let taskController: TaskController;

  const mockTaskService = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('create', () => {

    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        assign: '1',
        dueDate: new Date().toISOString(),
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        type: TaskType.TASK,
        completedAt: ''
      };

      mockTaskService.create.mockResolvedValue({
        ...createTaskDto,
        ...mockTask,
        id: '1',
      });

      const result = await taskController.create(createTaskDto);

      expect(result).toEqual({
        ...createTaskDto,
        ...mockTask,
        id: '1',
      });
      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findByUserId', () => {
    it('should return a list of tasks for a user', async () => {
      const tasks: Task[] = [
        { ...mockTask, id: '1', description: 'Description 2' },
        { ...mockTask, id: '2', description: 'Description 2' },
      ];
      mockTaskService.findByUserId.mockResolvedValue(tasks);

      const result = await taskController.findByUserId('1');

      expect(result).toEqual(tasks);
      expect(mockTaskService.findByUserId).toHaveBeenCalledWith('1');
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      const task: Task = { ...mockTask, id: '1', description: 'Description 2' };
      mockTaskService.findOne.mockResolvedValue(task);

      const result = await taskController.findOne('1');

      expect(result).toEqual(task);
      expect(mockTaskService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw an error if task not found', async () => {
      mockTaskService.findOne.mockRejectedValue(new NotFoundException('Tarefa com ID non-existing-id não encontrada.'));

      await expect(taskController.findOne('non-existing-id')).rejects.toThrow(
        new NotFoundException(`Tarefa com ID non-existing-id não encontrada.`)
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      mockTaskService.update.mockResolvedValue({ ...mockTask, ...updateTaskDto });

      const result = await taskController.update('1', updateTaskDto);

      expect(result).toEqual({ ...mockTask, ...updateTaskDto });
      expect(mockTaskService.update).toHaveBeenCalledWith('1', updateTaskDto);
    });

    it('should throw an error if task not found during update', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

      mockTaskService.update.mockRejectedValue(new NotFoundException('Tarefa com ID non-existing-id não encontrada.'));

      await expect(taskController.update('non-existing-id', updateTaskDto)).rejects.toThrow(
        new NotFoundException('Tarefa com ID non-existing-id não encontrada.')
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTaskService.remove.mockResolvedValue(undefined);

      const result = await taskController.remove('1');

      expect(result).toBeUndefined();
      expect(mockTaskService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw an error if task not found during removal', async () => {
      mockTaskService.remove.mockRejectedValue(new NotFoundException('Tarefa com ID non-existing-id não encontrada.'));

      await expect(taskController.remove('non-existing-id')).rejects.toThrow(
        new NotFoundException('Tarefa com ID non-existing-id não encontrada.')
      );
    });
  });

});
