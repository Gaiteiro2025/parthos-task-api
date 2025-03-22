import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistoryAction } from '../common/enums/task-history-action.enum';
import { TaskHistory } from '../task-history/entities/task-history.entity';
import { TaskHistoryService } from '../task-history/task-history.service';
import { TaskService } from '../task/task.service';
import { User } from '../users/entities/user.entity';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { UpdateTaskMessageDto } from './dto/update-task-message.dto';
import { TaskMessage } from './entities/task-message.entity';

@Injectable()
export class TaskMessageService {
  constructor(
    @InjectRepository(TaskMessage)
    private taskMessageRepository: Repository<TaskMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(TaskHistoryService)
    private readonly taskHistoryService: TaskHistoryService,
    @Inject(TaskService)
    private readonly taskService: TaskService
  ) { }

  async create(createTaskMessageDto: CreateTaskMessageDto): Promise<TaskMessage> {
    const [task, author] = await Promise.all([
      this.taskService.findOne(createTaskMessageDto.taskId),
      this.userRepository.findOne({ where: { id: createTaskMessageDto.authorId } })
    ]);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${createTaskMessageDto.taskId} não encontrada.`);
    }
    if (!author) {
      throw new NotFoundException(`Autor com ID ${createTaskMessageDto.authorId} não encontrado.`);
    }

    const taskMessage = this.taskMessageRepository.create({
      ...createTaskMessageDto,
      task,
      author
    });

    try {
      await this.taskHistoryService.createHistory({
        task: taskMessage.task,
        changedBy: taskMessage.author,
        action: TaskHistoryAction.MESSAGE_ADDED,
        newValue: taskMessage.message,
        createdAt: new Date(),
      } as TaskHistory);

      return await this.taskMessageRepository.save(taskMessage);
    } catch (error) {
      this.handleError(error, 'salvar mensagem da tarefa');
    }
  }

  async findByTaskId(taskId: string): Promise<TaskMessage[]> {
    try {
      const messages = await this.taskMessageRepository.find({ where: { task: { id: taskId } } });
      if (!messages.length) {
        throw new NotFoundException(`Nenhuma mensagem encontrada para a tarefa com ID ${taskId}.`);
      }
      return messages;
    } catch (error) {
      this.handleError(error, 'buscar mensagens da tarefa', taskId);
    }
  }

  async findOne(id: string): Promise<TaskMessage> {
    try {
      const taskMessage = await this.taskMessageRepository.findOne({ where: { id } });
      if (!taskMessage) {
        throw new NotFoundException(`Mensagem com ID ${id} não encontrada.`);
      }
      return taskMessage;
    } catch (error) {
      this.handleError(error, 'buscar mensagem', id);
    }
  }

  async update(id: string, updateTaskMessageDto: UpdateTaskMessageDto): Promise<TaskMessage> {
    const taskMessage = await this.findOne(id);
    Object.assign(taskMessage, updateTaskMessageDto);
    try {
      return await this.taskMessageRepository.save(taskMessage);
    } catch (error) {
      this.handleError(error, 'atualizar mensagem', id);
    }
  }

  async remove(id: string): Promise<void> {
    const taskMessage = await this.findOne(id);
    try {
      await this.taskMessageRepository.remove(taskMessage);
    } catch (error) {
      this.handleError(error, 'remover mensagem', id);
    }
  }

  private handleError(error: unknown, action: string, id?: string): void {
    if (error instanceof Error) {
      throw new InternalServerErrorException(`Erro ao ${action}${id ? ` com ID ${id}` : ''}: ${error.message}`);
    }
    throw new InternalServerErrorException(`Erro desconhecido ao ${action}${id ? ` com ID ${id}` : ''}`);
  }
}
