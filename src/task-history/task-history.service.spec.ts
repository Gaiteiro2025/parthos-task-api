import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistoryAction } from '../common/enums/task-history-action.enum';
import { mockTaskHistory } from '../common/mocks/task-history.mock';
import { mockTask } from '../common/mocks/task.mock';
import { TaskHistory } from './entities/task-history.entity';
import { TaskHistoryService } from './task-history.service';

describe('TaskHistoryService', () => {
  let taskHistoryService: TaskHistoryService;
  let taskHistoryRepository: Repository<TaskHistory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskHistoryService,
        {
          provide: getRepositoryToken(TaskHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    taskHistoryService = module.get<TaskHistoryService>(TaskHistoryService);
    taskHistoryRepository = module.get<Repository<TaskHistory>>(getRepositoryToken(TaskHistory));
  });

  describe('createHistory', () => {
    it('should create and return a task history record', async () => {
      const historyData: TaskHistory = mockTaskHistory;
      const savedHistory: TaskHistory = { id: 'history-id', ...historyData };

      taskHistoryRepository.create = jest.fn().mockReturnValue(savedHistory);
      taskHistoryRepository.save = jest.fn().mockResolvedValue(savedHistory);

      const result = await taskHistoryService.createHistory(historyData);

      expect(result).toEqual(savedHistory);
      expect(taskHistoryRepository.create).toHaveBeenCalledWith(historyData);
      expect(taskHistoryRepository.save).toHaveBeenCalledWith(savedHistory);
    });
  });

  describe('createMany', () => {
    it('should create and return multiple task history records', async () => {
      const historiesData: TaskHistory[] = [
        {
          ...mockTaskHistory,
          action: TaskHistoryAction.CREATED,
        },
        {
          ...mockTaskHistory,
          action: TaskHistoryAction.UPDATED,
        },
      ];
      const savedHistories = historiesData.map((data, index) => ({ id: `history-${index}`, ...data }));

      taskHistoryRepository.create = jest.fn().mockReturnValue(savedHistories);
      taskHistoryRepository.save = jest.fn().mockResolvedValue(savedHistories);

      const result = await taskHistoryService.createMany(historiesData);

      expect(result).toEqual(savedHistories);
      expect(taskHistoryRepository.create).toHaveBeenCalledWith(historiesData);
      expect(taskHistoryRepository.save).toHaveBeenCalledWith(savedHistories);
    });
  });

  describe('findByTaskId', () => {
    it('should return task history records for a given task', async () => {
      const taskId = 'task-id';
      const histories: TaskHistory[] = [{ ...mockTaskHistory, id: 'history-id', task: { ...mockTask, id: taskId }, action: TaskHistoryAction.CREATED }];

      taskHistoryRepository.find = jest.fn().mockResolvedValue(histories);

      const result = await taskHistoryService.findByTaskId(taskId);

      expect(result).toEqual(histories);
      expect(taskHistoryRepository.find).toHaveBeenCalledWith({ where: { task: { id: taskId } } });
    });
  });

  describe('findOne', () => {
    it('should return a task history record by id', async () => {
      const historyId = 'history-id';
      const history: TaskHistory = { ...mockTaskHistory, id: historyId, task: { ...mockTask, id: 'task-id' }, action: TaskHistoryAction.CREATED }
      taskHistoryRepository.findOne = jest.fn().mockResolvedValue(history);

      const result = await taskHistoryService.findOne(historyId);

      expect(result).toEqual(history);
      expect(taskHistoryRepository.findOne).toHaveBeenCalledWith({ where: { id: historyId } });
    });

    it('should throw NotFoundException if history is not found', async () => {
      const historyId = 'invalid-history-id';

      taskHistoryRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(taskHistoryService.findOne(historyId)).rejects.toThrowError(
        new NotFoundException(`Erro ao buscar o histórico da tarefa com ID invalid-history-id: Histórico de tarefa com ID invalid-history-id não encontrado.`)
      );
    });
  });

  describe('remove', () => {
    it('should remove a task history record', async () => {
      taskHistoryRepository.findOne = jest.fn().mockResolvedValue(mockTaskHistory);
      taskHistoryRepository.remove = jest.fn();

      await taskHistoryService.remove(mockTaskHistory.id);

      expect(taskHistoryRepository.remove).toHaveBeenCalledWith(mockTaskHistory);
    });

    it('should throw NotFoundException if history is not found', async () => {
      const historyId = 'invalid-history-id';

      taskHistoryRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(taskHistoryService.remove(historyId)).rejects.toThrowError(
        new NotFoundException("Erro ao remover o histórico da tarefa com ID invalid-history-id: Erro ao buscar o histórico da tarefa com ID invalid-history-id: Histórico de tarefa com ID invalid-history-id não encontrado.")
      );
    });
  });
});
