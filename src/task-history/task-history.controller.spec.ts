import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskHistoryAction } from '../common/enums/task-history-action.enum';
import { mockTaskHistory } from '../common/mocks/task-history.mock';
import { TaskHistory } from './entities/task-history.entity';
import { TaskHistoryController } from './task-history.controller';
import { TaskHistoryService } from './task-history.service';

jest.mock('../auth/guards/jwt-auth.guard');

describe('TaskHistoryController', () => {
  let taskHistoryController: TaskHistoryController;

  const mockTaskHistoryService = {
    findByTaskId: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskHistoryController],
      providers: [
        { provide: TaskHistoryService, useValue: mockTaskHistoryService },
      ],
    }).compile();

    taskHistoryController = module.get<TaskHistoryController>(TaskHistoryController);
  });

  it('should be defined', () => {
    expect(taskHistoryController).toBeDefined();
  });

  describe('findByTaskId', () => {
    it('should return a list of task history for a task', async () => {
      const taskHistories: TaskHistory[] = [
        { ...mockTaskHistory, id: '1' },
        { ...mockTaskHistory, id: '2', action: TaskHistoryAction.UPDATED },
      ];

      mockTaskHistoryService.findByTaskId.mockResolvedValue(taskHistories);

      const result = await taskHistoryController.findByTaskId('1');

      expect(result).toEqual(taskHistories);
      expect(mockTaskHistoryService.findByTaskId).toHaveBeenCalledWith('1');
    });
  });

  describe('findOne', () => {
    it('should return a task history by ID', async () => {
      const taskHistory: TaskHistory = { ...mockTaskHistory, id: '1', action: TaskHistoryAction.CREATED };
      mockTaskHistoryService.findOne.mockResolvedValue(taskHistory);

      const result = await taskHistoryController.findOne('1');

      expect(result).toEqual(taskHistory);
      expect(mockTaskHistoryService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw an error if task history not found', async () => {
      mockTaskHistoryService.findOne.mockRejectedValue(new NotFoundException('Histórico não encontrado'));

      await expect(taskHistoryController.findOne('non-existing-id')).rejects.toThrowError('Histórico não encontrado');
    });
  });

  describe('remove', () => {
    it('should remove a task history', async () => {
      mockTaskHistoryService.remove.mockResolvedValue(undefined);

      const result = await taskHistoryController.remove('1');

      expect(result).toBeUndefined();
      expect(mockTaskHistoryService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw an error if task history not found during removal', async () => {
      mockTaskHistoryService.remove.mockRejectedValue(new NotFoundException('Tarefa com ID non-existing-id não encontrada.'));

      await expect(taskHistoryController.remove('non-existing-id')).rejects.toThrow(
        new NotFoundException('Tarefa com ID non-existing-id não encontrada.')
      );
    });
  });
});
