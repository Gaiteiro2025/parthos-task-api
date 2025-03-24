import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockTaskMessage } from '../common/mocks/task-message.mock';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { UpdateTaskMessageDto } from './dto/update-task-message.dto';
import { TaskMessage } from './entities/task-message.entity';
import { TaskMessageController } from './task-message.controller';
import { TaskMessageService } from './task-message.service';

jest.mock('../auth/guards/jwt-auth.guard');

describe('TaskMessageController', () => {
  let taskMessageController: TaskMessageController;

  const mockTaskMessageService = {
    create: jest.fn(),
    findByTaskId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskMessageController],
      providers: [
        { provide: TaskMessageService, useValue: mockTaskMessageService },
      ],
    }).compile();

    taskMessageController = module.get<TaskMessageController>(TaskMessageController);
  });

  it('should be defined', () => {
    expect(taskMessageController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task message', async () => {
      const createTaskMessageDto: CreateTaskMessageDto = {
        message: 'New task message',
        taskId: '1',
        authorId: ''
      };

      const createdTaskMessage: TaskMessage = {
        ...mockTaskMessage,
        id: '1',
        ...createTaskMessageDto,
      };

      mockTaskMessageService.create.mockResolvedValue(createdTaskMessage);

      const result = await taskMessageController.create(createTaskMessageDto);

      expect(result).toEqual(createdTaskMessage);
      expect(mockTaskMessageService.create).toHaveBeenCalledWith(createTaskMessageDto);
    });
  });

  describe('findByTaskId', () => {
    it('should return a list of task messages for a task', async () => {
      const taskMessages: TaskMessage[] = [
        { ...mockTaskMessage, id: '1', message: 'Message 1' },
        { ...mockTaskMessage, id: '2', message: 'Message 2' },
      ];

      mockTaskMessageService.findByTaskId.mockResolvedValue(taskMessages);

      const result = await taskMessageController.findByTaskId('1');

      expect(result).toEqual(taskMessages);
      expect(mockTaskMessageService.findByTaskId).toHaveBeenCalledWith('1');
    });
  });

  describe('findOne', () => {
    it('should return a task message by ID', async () => {
      const taskMessage: TaskMessage = mockTaskMessage;
      mockTaskMessageService.findOne.mockResolvedValue(taskMessage);

      const result = await taskMessageController.findOne('1');

      expect(result).toEqual(taskMessage);
      expect(mockTaskMessageService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw an error if task message not found', async () => {
      mockTaskMessageService.findOne.mockRejectedValue(new NotFoundException('Tarefa com ID non-existing-id não encontrada.'));

      await expect(taskMessageController.findOne('non-existing-id')).rejects.toThrow(new NotFoundException(`Tarefa com ID non-existing-id não encontrada.`));
    });
  });

  describe('update', () => {
    it('should update a task message', async () => {
      const updateTaskMessageDto: UpdateTaskMessageDto = { message: 'Updated message content' };
      const updatedTaskMessage: TaskMessage = mockTaskMessage;

      mockTaskMessageService.update.mockResolvedValue(updatedTaskMessage);

      const result = await taskMessageController.update('1', updateTaskMessageDto);

      expect(result).toEqual(updatedTaskMessage);
      expect(mockTaskMessageService.update).toHaveBeenCalledWith('1', updateTaskMessageDto);
    });

    it('should throw an error if task message not found during update', async () => {
      const updateTaskMessageDto: UpdateTaskMessageDto = { message: 'Updated message content' };

      mockTaskMessageService.update.mockRejectedValue(new NotFoundException('Tarefa com ID non-existing-id não encontrada.'));

      await expect(taskMessageController.update('non-existing-id', updateTaskMessageDto)).rejects.toThrow(new NotFoundException('Tarefa com ID non-existing-id não encontrada.'));
    });
  });

  describe('remove', () => {
    it('should remove a task message', async () => {
      mockTaskMessageService.remove.mockResolvedValue(undefined);

      const result = await taskMessageController.remove('1');

      expect(result).toBeUndefined();
      expect(mockTaskMessageService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw an error if task message not found during removal', async () => {
      mockTaskMessageService.remove.mockRejectedValue(new NotFoundException('Tarefa com ID non-existing-id não encontrada.'));

      await expect(taskMessageController.remove('non-existing-id')).rejects.toThrow(
        new NotFoundException('Tarefa com ID non-existing-id não encontrada.')
      );
    });
  });

});
