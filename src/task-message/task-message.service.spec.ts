import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistoryAction } from '../common/enums/task-history-action.enum';
import { mockTaskMessage } from '../common/mocks/task-message.mock';
import { mockTask } from '../common/mocks/task.mock';
import { TaskHistoryService } from '../task-history/task-history.service';
import { Task } from '../task/entities/task.entity';
import { TaskService } from '../task/task.service';
import { User } from '../users/entities/user.entity';
import { mockUser } from '../users/mocks/mockUser';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { UpdateTaskMessageDto } from './dto/update-task-message.dto';
import { TaskMessage } from './entities/task-message.entity';
import { TaskMessageService } from './task-message.service';

describe('TaskMessageService', () => {
  let taskMessageService: TaskMessageService;
  let taskMessageRepository: Repository<TaskMessage>;
  let userRepository: Repository<User>;
  let taskHistoryService: TaskHistoryService;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskMessageService,
        {
          provide: getRepositoryToken(TaskMessage),
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
        {
          provide: TaskService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    taskMessageService = module.get<TaskMessageService>(TaskMessageService);
    taskMessageRepository = module.get<Repository<TaskMessage>>(getRepositoryToken(TaskMessage));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    taskHistoryService = module.get<TaskHistoryService>(TaskHistoryService);
    taskService = module.get<TaskService>(TaskService);
  });

  describe('create', () => {
    it('should create and return a task message', async () => {
      const createDto: CreateTaskMessageDto = { taskId: 'task-id', authorId: 'user-id', message: 'Test message' };
      const task: Task = { ...mockTask, id: createDto.taskId };
      const author: User = { ...mockUser, id: createDto.authorId };
      const savedMessage: TaskMessage = { ...mockTaskMessage, id: 'message-id', task, author, message: createDto.message };

      jest.spyOn(taskService, 'findOne').mockResolvedValue(task);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(author);
      jest.spyOn(taskMessageRepository, 'create').mockReturnValue(savedMessage);
      jest.spyOn(taskMessageRepository, 'save').mockResolvedValue(savedMessage);
      jest.spyOn(taskHistoryService, 'createHistory').mockResolvedValue(undefined);

      const result = await taskMessageService.create(createDto);

      expect(result).toEqual(savedMessage);
      expect(taskService.findOne).toHaveBeenCalledWith(createDto.taskId);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.authorId } });
      expect(taskMessageRepository.create).toHaveBeenCalledWith({ ...createDto, task, author });
      expect(taskMessageRepository.save).toHaveBeenCalledWith(savedMessage);
      expect(taskHistoryService.createHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          task: expect.objectContaining({ id: createDto.taskId }), // Garante que a task está correta
          changedBy: expect.objectContaining({ id: createDto.authorId }), // Confirma o usuário correto
          action: TaskHistoryAction.MESSAGE_ADDED,
          newValue: createDto.message,
          createdAt: expect.any(Date), // Garante que a data pode variar
        })
      );
    });
  });


  describe('findByTaskId', () => {
    it('should return task messages for a given task', async () => {
      const taskId = 'task-id';
      const messages: TaskMessage[] = [{ ...mockTaskMessage, id: 'message-id', task: { ...mockTask, id: taskId }, message: 'Test message' }];

      jest.spyOn(taskMessageRepository, 'find').mockResolvedValue(messages);

      const result = await taskMessageService.findByTaskId(taskId);

      expect(result).toEqual(messages);
      expect(taskMessageRepository.find).toHaveBeenCalledWith({ where: { task: { id: taskId } } });
    });
  });

  describe('findOne', () => {
    it('should return a task message by id', async () => {
      const messageId = 'message-id';
      const message: TaskMessage = { ...mockTaskMessage, id: messageId, task: { ...mockTask, id: 'task-id' }, message: 'Test message' };


      jest.spyOn(taskMessageRepository, 'findOne').mockResolvedValue(message);

      const result = await taskMessageService.findOne(messageId);

      expect(result).toEqual(message);
      expect(taskMessageRepository.findOne).toHaveBeenCalledWith({ where: { id: messageId } });
    });

    it('should throw NotFoundException if message is not found', async () => {
      const messageId = 'invalid-message-id';

      jest.spyOn(taskMessageRepository, 'findOne').mockResolvedValue(null);

      await expect(taskMessageService.findOne(messageId)).rejects.toThrow(
        new NotFoundException(`Erro ao buscar mensagem com ID invalid-message-id: Mensagem com ID invalid-message-id não encontrada.`)
      );
    });
  });

  describe('update', () => {
    it('should update and return a task message', async () => {
      const messageId = 'message-id';
      const updateDto: UpdateTaskMessageDto = { message: 'Updated message' };
      const existingMessage: TaskMessage = { ...mockTaskMessage, id: messageId, task: { ...mockTask, id: 'task-id' }, message: 'Old message' };
      const updatedMessage: TaskMessage = { ...existingMessage, ...updateDto };

      jest.spyOn(taskMessageRepository, 'findOne').mockResolvedValue(existingMessage);
      jest.spyOn(taskMessageRepository, 'save').mockResolvedValue(updatedMessage);

      const result = await taskMessageService.update(messageId, updateDto);

      expect(result).toEqual(updatedMessage);
      expect(taskMessageRepository.save).toHaveBeenCalledWith(updatedMessage);
    });

    it('should throw NotFoundException if message is not found', async () => {
      const messageId = 'invalid-message-id';
      const updateDto: UpdateTaskMessageDto = { message: 'Updated message' };

      jest.spyOn(taskMessageRepository, 'findOne').mockResolvedValue(null);

      await expect(taskMessageService.update(messageId, updateDto)).rejects.toThrow(
        new NotFoundException(`Erro ao buscar mensagem com ID invalid-message-id: Mensagem com ID invalid-message-id não encontrada.`)
      );
    });
  });

  describe('remove', () => {
    it('should remove a task message', async () => {
      const messageId = 'message-id';
      const message: TaskMessage = { ...mockTaskMessage, id: messageId, task: { ...mockTask, id: 'task-id' }, message: 'Test message' };

      jest.spyOn(taskMessageRepository, 'findOne').mockResolvedValue(message);
      jest.spyOn(taskMessageRepository, 'remove').mockResolvedValue(undefined);

      await taskMessageService.remove(messageId);

      expect(taskMessageRepository.remove).toHaveBeenCalledWith(message);
    });

    it('should throw NotFoundException if message is not found', async () => {
      const messageId = 'invalid-message-id';

      jest.spyOn(taskMessageRepository, 'findOne').mockResolvedValue(null);

      await expect(taskMessageService.remove(messageId)).rejects.toThrowError(
        new NotFoundException(`Erro ao buscar mensagem com ID invalid-message-id: Mensagem com ID invalid-message-id não encontrada.`)
      );
    });
  });
});
