import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistoryAction } from '../common/enums/task-history-action.enum';
import { TaskPriority } from '../common/enums/task-priority.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { TaskType } from '../common/enums/task-type.enum';
import { mockTask } from '../common/mocks/task.mock';
import { TaskHistoryService } from '../task-history/task-history.service';
import { User } from '../users/entities/user.entity';
import { mockUser } from '../users/mocks/mockUser';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';

jest.mock('../task-history/task-history.service');

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;
  let taskHistoryService: TaskHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: TaskHistoryService,
          useValue: {
            createHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    taskHistoryService = module.get<TaskHistoryService>(TaskHistoryService);
    taskHistoryService.createHistoryByTaskUpdate = jest.fn().mockResolvedValue(true);

  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        assign: 'user-id',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        type: TaskType.TASK,
        dueDate: '',
        completedAt: ''
      };
      const user = { ...mockUser, id: 'user-id', name: 'Test User' };
      const savedTask = { ...mockTask, id: 'task-id', ...createTaskDto };

      userRepository.findOne = jest.fn().mockResolvedValue(user);
      taskRepository.create = jest.fn().mockReturnValue(savedTask);
      taskRepository.save = jest.fn().mockResolvedValue(savedTask);

      const result = await taskService.create(createTaskDto);

      expect(result).toEqual(savedTask);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'user-id' } });
      expect(taskRepository.save).toHaveBeenCalledWith(savedTask);
      expect(taskHistoryService.createHistory).toHaveBeenCalledWith({
        task: savedTask,
        changedBy: user,
        action: 'created',
        createdAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        assign: 'invalid-user-id',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        type: TaskType.TASK,
        dueDate: '',
        completedAt: ''
      };

      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(taskService.create(createTaskDto)).rejects.toThrow(
        new NotFoundException('Erro ao criar tarefa: Erro ao buscar o usuário com ID invalid-user-id: Usuário com ID invalid-user-id não encontrado.')
      );
    });

    it('should throw error instanceof not Error in create', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        assign: 'invalid-user-id',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        type: TaskType.TASK,
        dueDate: '',
        completedAt: ''
      };

      userRepository.findOne = jest.fn().mockRejectedValue(null);

      await expect(taskService.create(createTaskDto)).rejects.toThrow(
        new InternalServerErrorException('Erro ao criar tarefa: Erro desconhecido ao buscar o usuário com ID invalid-user-id')
      );
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const task = { id: 'task-id', title: 'Test Task', assign: { id: 'user-id', name: 'Test User' } };

      taskRepository.findOne = jest.fn().mockResolvedValue(task);

      const result = await taskService.findOne('task-id');

      expect(result).toEqual(task);
      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 'task-id' }, relations: ['assign'] });
    });

    it('should throw NotFoundException if task is not found', async () => {
      taskRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(taskService.findOne('invalid-task-id')).rejects.toThrow(
        new NotFoundException('Erro ao buscar a tarefa com ID invalid-task-id: Tarefa com ID invalid-task-id não encontrada.')
      );
    });
  });

  describe('findByUserId', () => {
    it('should return tasks assigned to a user', async () => {
      const tasks: Task[] = [{ ...mockTask, assign: { ...mockUser, id: 'user-id', name: 'Test User' } }];
      taskRepository.find = jest.fn().mockResolvedValue(tasks);

      const result = await taskService.findByUserId('user-id');

      expect(result).toEqual(tasks);
      expect(taskRepository.find).toHaveBeenCalledWith({ where: { assign: { id: 'user-id' } } });
    });

    it('should return an empty array if no tasks are assigned to the user', async () => {
      taskRepository.find = jest.fn().mockResolvedValue([]);

      const result = await taskService.findByUserId('user-id');

      expect(result).toEqual([]);
      expect(taskRepository.find).toHaveBeenCalledWith({ where: { assign: { id: 'user-id' } } });
    });
  });


  describe('update', () => {
    it('should update task assign', async () => {
      const assign = { ...mockUser, id: '2b41df35-832b-4f89-8b84-afaf2c1aec0d' }
      const updateTaskDto: UpdateTaskDto = { assign: assign.id };
      const updatedTask = { ...mockTask, assign }
      userRepository.findOne = jest.fn().mockResolvedValue(assign);
      taskRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.assign.id).toBe(assign.id);
    });

    it('should throw internal server error if update fails', async () => {
      const updatedAssign = { ...mockUser, id: '2b41df35-832b-4f89-8b84-afaf2c1aec0d' };
      const updateTaskDto = { assign: updatedAssign.id };
      taskRepository.save = jest.fn().mockRejectedValue(new InternalServerErrorException('Failed to save'));

      await expect(taskService.update(mockTask.id, updateTaskDto))
        .rejects
        .toThrow(InternalServerErrorException);
    });


    it('should update task title', async () => {
      const title = 'Updated Task';
      const updateTaskDto: UpdateTaskDto = { title };
      const updatedTask = { ...mockTask, title }
      taskRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.title).toBe(title);
    });


    it('should update task description', async () => {
      const description = 'Corrigir Bugs'
      const updateTaskDto: UpdateTaskDto = { description };
      const updatedTask = { ...mockTask, description }
      taskRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.description).toBe(description);
    });

    it('should update task type', async () => {
      const type = TaskType.EPIC
      const updateTaskDto: UpdateTaskDto = { type }
      const updatedTask = { ...mockTask, type }
      taskRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.type).toBe(type);
    });

    it('should update task priority', async () => {
      const priority = TaskPriority.LOW
      const updateTaskDto: UpdateTaskDto = { priority }
      const updatedTask = { ...mockTask, priority }
      taskRepository.findOne = jest.fn().mockResolvedValue({ ...mockTask, priority: TaskPriority.MEDIUM });
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);
      expect(result.priority).toBe(priority);
    });

    it('should update task dueDate', async () => {
      const dueDate = new Date();
      const updateTaskDto: UpdateTaskDto = { dueDate: dueDate.toISOString() }
      const updatedTask = { ...mockTask, dueDate }
      taskRepository.findOne = jest.fn().mockResolvedValue({ ...mockTask, completedAt: null });
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.dueDate).toBe(dueDate);

    });

    it('should update task dueDate', async () => {
      const dueDate = new Date();
      const updateTaskDto: UpdateTaskDto = { dueDate: dueDate.toISOString() }
      const updatedTask = { ...mockTask, dueDate }
      taskRepository.findOne = jest.fn().mockResolvedValue({ ...mockTask, completedAt: null });
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.dueDate).toBe(dueDate);

    });

    it('should update task completedAt', async () => {
      const completedAt = new Date();
      const updateTaskDto: UpdateTaskDto = { completedAt: completedAt.toISOString() }
      const updatedTask = { ...mockTask, completedAt }
      taskRepository.findOne = jest.fn().mockResolvedValue({ ...mockTask, completedAt: null });
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.completedAt).toBe(completedAt);
      expect(updatedTask.completedAt).not.toBeNull();

    });

    it('should update task priority', async () => {
      const priority = TaskPriority.LOW
      const updateTaskDto: UpdateTaskDto = { priority }
      const updatedTask = { ...mockTask, priority }
      taskRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.priority).toBe(priority);
    });

    it('Should not create history if new title is equal to old title', async () => {
      const title = mockTask.title;
      const updateTaskDto: UpdateTaskDto = { title };
      const updatedTask = { ...mockTask, title }
      taskRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.title).toBe(title);
      expect(taskRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if task is not found', async () => {
      taskRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(taskService.update('invalid-task-id', { title: 'Updated Task' })).rejects.toThrow(
        new NotFoundException('Erro ao atualizar a tarefa com ID invalid-task-id: Erro ao buscar a tarefa com ID invalid-task-id: Tarefa com ID invalid-task-id não encontrada.')
      );
    });
  });

  describe('update status', () => {
    it('should update task status to "Blocked"', async () => {
      const status = TaskStatus.BLOCKED;
      const updateTaskDto: UpdateTaskDto = { status };
      const updatedTask = { ...mockTask, status };
      taskRepository.findOne = jest.fn().mockResolvedValue({ ...mockTask, status: TaskStatus.TODO });
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.status).toBe(status);
    });

    it('should update task status to "IN_PROGRESS" AND completedAt is null', async () => {
      const status = TaskStatus.IN_PROGRESS;
      const updateTaskDto: UpdateTaskDto = { status };
      const updatedTask = { ...mockTask, status };
      const task: Task = { ...mockTask, status: TaskStatus.TODO, completedAt: null };
      taskRepository.findOne = jest.fn().mockResolvedValue(task);
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);

      expect(result.status).toBe(status);
      expect(updatedTask.completedAt).toBeNull();
    });

    it('should update task status to "DONE"', async () => {
      const status = TaskStatus.DONE;
      const updateTaskDto: UpdateTaskDto = { status };
      const updatedTask = { ...mockTask, status };
      const task: Task = { ...mockTask, status: TaskStatus.TODO };

      taskRepository.findOne = jest.fn().mockResolvedValue(task);
      taskRepository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await taskService.update(updatedTask.id, updateTaskDto);
      expect(result.status).toBe(status);

    });

  });

  describe('remove', () => {
    it('should remove the task', async () => {

      taskRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      taskRepository.remove = jest.fn();
      await taskService.remove(mockTask.id);
      expect(taskRepository.remove).toHaveBeenCalledWith(mockTask);
      expect(taskHistoryService.createHistory).toHaveBeenCalledWith(expect.objectContaining({
        task: mockTask,
        action: TaskHistoryAction.DELETED,
      }));
    });

    it('should throw NotFoundException if task is not found', async () => {
      taskRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(taskService.remove('invalid-task-id')).rejects.toThrow(
        new NotFoundException('Erro ao remover a tarefa com ID invalid-task-id: Erro ao buscar a tarefa com ID invalid-task-id: Tarefa com ID invalid-task-id não encontrada.')
      );
    });

    it('should throw error instanceof not Error in remove', async () => {
      taskRepository.findOne = jest.fn().mockRejectedValue(null);

      await expect(taskService.remove('invalid-task-id')).rejects.toThrow(
        new InternalServerErrorException('Erro ao remover a tarefa com ID invalid-task-id: Erro desconhecido ao buscar a tarefa com ID invalid-task-id')
      );
    });
  });
});