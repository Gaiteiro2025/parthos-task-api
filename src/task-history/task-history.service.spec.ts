import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { TaskHistoryAction } from '../common/enums/task-history-action.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { TaskType } from '../common/enums/task-type.enum';
import { mockTaskHistory } from '../common/mocks/task-history.mock';
import { mockTask } from '../common/mocks/task.mock';
import { Task } from '../task/entities/task.entity';
import { mockUser } from '../users/mocks/mockUser';
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

    it('should create history by task update (1 field task updated)', async () => {
      const actionExpected = TaskHistoryAction.UPDATED
      const task: Task = { ...mockTaskHistory.task, status: TaskStatus.TODO };
      const changesUpdate = { fieldChanged: 'status', newValue: TaskStatus.BLOCKED, oldValue: task.status };
      const createTaskHistory: TaskHistory = { id: 'history-id', ...mockTaskHistory, task, ...changesUpdate, action: actionExpected };
      const resultExpected = {
        ...changesUpdate,
        action: TaskHistoryAction.UPDATED
      }

      taskHistoryRepository.create = jest.fn().mockReturnValue(createTaskHistory);
      taskHistoryRepository.save = jest.fn().mockResolvedValue(createTaskHistory);

      await taskHistoryService.createHistoryByTaskUpdate(task, createTaskHistory.changedBy, [changesUpdate]);

      expect(taskHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining(resultExpected));
      expect(taskHistoryRepository.save).toHaveBeenCalledWith(createTaskHistory);
    });

    it('should create history by task update (more field task updated) ', async () => {
      const actionExpected = TaskHistoryAction.UPDATED_MANY
      const task: Task = { ...mockTaskHistory.task, status: TaskStatus.TODO, type: TaskType.BUG };
      const changesUpdate = [
        { fieldChanged: 'status', newValue: TaskStatus.BLOCKED, oldValue: task.status },
        { fieldChanged: 'type', newValue: TaskType.TASK, oldValue: task.status },
      ];
      const createTaskHistory: TaskHistory = {
        id: 'history-id', ...mockTaskHistory, task,
        fieldChanged: '',
        oldValue: '',
        newValue: '', action: actionExpected
      };
      const resultExpected = {
        fieldChanged: '',
        oldValue: '',
        newValue: '',
        action: TaskHistoryAction.UPDATED_MANY
      }

      taskHistoryRepository.create = jest.fn().mockReturnValue(createTaskHistory);
      taskHistoryRepository.save = jest.fn().mockResolvedValue(createTaskHistory);

      await taskHistoryService.createHistoryByTaskUpdate(task, createTaskHistory.changedBy, changesUpdate);

      expect(taskHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining(resultExpected));
      expect(taskHistoryRepository.save).toHaveBeenCalledWith(expect.objectContaining(resultExpected));

    });

    it('should throw error instanceof not Error in create', async () => {
      const historyData: TaskHistory = mockTaskHistory;


      taskHistoryRepository.findOne = jest.fn().mockRejectedValue(null);

      await expect(taskHistoryService.createHistory(historyData)).rejects.toThrow(
        new InternalServerErrorException("Erro ao salvar o histórico da tarefa: Cannot read properties of undefined (reading 'create')")
      );
    });

    it('should throw error instanceof not Error in create by task update', async () => {
      taskHistoryRepository.findOne = jest.fn().mockRejectedValue(null);
      await expect(taskHistoryService.createHistoryByTaskUpdate(mockTask, mockUser, [{ fieldChanged: 'status', newValue: TaskStatus.BLOCKED, oldValue: mockTask.status }])).rejects.toThrow(
        new InternalServerErrorException("Erro ao registrar histórico de atualização da tarefa: Erro ao salvar o histórico da tarefa: Cannot read properties of undefined (reading 'create')")
      );
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

    it('should throw error instanceof not Error in create', async () => {
      const historyData: TaskHistory[] = [mockTaskHistory];


      taskHistoryRepository.findOne = jest.fn().mockRejectedValue(null);

      await expect(taskHistoryService.createMany(historyData)).rejects.toThrow(
        new InternalServerErrorException("Erro ao salvar múltiplos históricos de tarefa: Cannot read properties of undefined (reading 'create')")
      );
    });
  });

  describe('findByTaskId', () => {
    it('should return task history records for a given task', async () => {
      const taskId = 'task-id';
      const histories: TaskHistory[] = [{ ...mockTaskHistory, id: 'history-id', task: { ...mockTask, id: taskId }, action: TaskHistoryAction.CREATED }];

      taskHistoryRepository.find = jest.fn().mockResolvedValue(histories);

      const result = await firstValueFrom(taskHistoryService.findByTaskId(taskId));

      expect(result).toEqual(histories);
      expect(taskHistoryRepository.find).toHaveBeenCalledWith({
        where: { task: { id: taskId } },
        relations: ['task', 'changedBy'],
        order: {
          createdAt: 'DESC',
        }
      });
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
