import { ApiPropertyOptions } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskType } from '../enums/task-type.enum';
import { mockTask } from '../mocks/task.mock';

export const TaskSwagger: { [x: string]: ApiPropertyOptions } = {
    id: {
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID único da tarefa',
    },
    title: {
        example: 'Corrigir bug no login',
        description: 'Título da tarefa',
    },
    description: {
        example: 'O sistema não está validando corretamente os tokens de autenticação.',
        description: 'Descrição detalhada da tarefa',
    },
    status: {
        example: TaskStatus.TODO,
        enum: TaskStatus,
        description: 'Status da tarefa (TODO, IN_PROGRESS, DONE)',
    },
    assign: {
        example: mockTask.assign,
        description: 'Usuário responsável pela tarefa',
        type: () => User,
    },
    type: {
        example: TaskType.BUG,
        enum: TaskType,
        description: 'Tipo da tarefa (TASK, BUG, FEATURE, IMPROVEMENT, EPIC)',
    },
    priority: {
        example: TaskPriority.HIGH,
        enum: TaskPriority,
        description: 'Prioridade da tarefa (LOW, MEDIUM, HIGH, URGENT)',
    },
    dueDate: {
        example: '2025-03-25T18:00:00.000Z',
        description: 'Data de vencimento da tarefa',
        nullable: true,
    },
    completedAt: {
        example: '2025-03-22T12:00:00.000Z',
        description: 'Data de conclusão da tarefa',
    },
    createdAt: {
        example: '2025-03-20T14:30:00.000Z',
        description: 'Data de criação da tarefa',
    },
    updatedAt: {
        example: '2025-03-21T16:00:00.000Z',
        description: 'Última atualização da tarefa',
    },
};
