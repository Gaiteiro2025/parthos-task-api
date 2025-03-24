import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { TaskHistoryAction } from '../common/enums/task-history-action.enum';
import { handleError } from '../common/handle.error';
import { TaskChange } from '../common/TaskChange';
import { Task } from '../task/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TaskHistory } from './entities/task-history.entity';

@Injectable()
export class TaskHistoryService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) { }


  async createHistory(data: Partial<TaskHistory>): Promise<TaskHistory> {
    try {
      const history = this.taskHistoryRepository.create(data);
      return await this.taskHistoryRepository.save(history);
    } catch (error) {
      handleError(error, 'salvar o histórico da tarefa');
    }
  }

  async createMany(data: Partial<TaskHistory>[]): Promise<TaskHistory[]> {
    try {
      const histories = this.taskHistoryRepository.create(data);
      return await this.taskHistoryRepository.save(histories);
    } catch (error) {
      handleError(error, 'salvar múltiplos históricos de tarefa');
    }
  }

  findByTaskId(taskId: string): Observable<TaskHistory[]> {
    const histories = this.taskHistoryRepository.find({
      where: { task: { id: taskId } },
      relations: ['task', 'changedBy'],
      order: {
        createdAt: 'DESC',
      }
    });

    return from(histories);
  }

  async findOne(id: string): Promise<TaskHistory> {
    try {
      const taskHistory = await this.taskHistoryRepository.findOne({ where: { id } });
      if (!taskHistory) {
        throw new NotFoundException(`Histórico de tarefa com ID ${id} não encontrado.`);
      }
      return taskHistory;
    } catch (error) {
      handleError(error, 'buscar o histórico da tarefa', id);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const history = await this.findOne(id);
      await this.taskHistoryRepository.remove(history);
    } catch (error) {
      handleError(error, 'remover o histórico da tarefa', id);
    }
  }

  async createHistoryByTaskUpdate(task: Task, changedBy: User, changes: TaskChange[]): Promise<void> {
    try {
      const [change] = changes;
      await this.createHistory({
        task,
        changedBy,
        action: changes.length === 1 ? TaskHistoryAction.UPDATED : TaskHistoryAction.UPDATED_MANY,
        ...(changes.length === 1 ? change : { fieldChanged: '', oldValue: '', newValue: '' }),
      });
    } catch (error) {
      handleError(error, 'registrar histórico de atualização da tarefa');
    }
  }
}
