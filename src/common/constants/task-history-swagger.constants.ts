import { ApiPropertyOptions } from "@nestjs/swagger";
import { Task } from "../../task/entities/task.entity";
import { User } from "../../users/entities/user.entity";

export const TaskHistorySwagger: { [x: string]: ApiPropertyOptions } = {
    id: {
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID do histórico de alteração',
    },
    task: {
        description: 'Tarefa associada à alteração',
        type: () => Task,
    },
    changedBy: {
        description: 'Usuário que realizou a alteração',
        type: () => User,
    },
    fieldChanged: {
        example: 'status',
        description: 'Campo que foi alterado',
        nullable: true,
    },
    oldValue: {
        example: 'pending',
        description: 'Valor antigo do campo alterado',
        nullable: true,
    },
    newValue: {
        example: 'in-progress',
        description: 'Novo valor do campo alterado',
        nullable: true,
    },
    createdAt: {
        example: '2025-03-20T14:00:00.000Z',
        description: 'Data e hora da alteração',
    },
    action: {
        example: 'action',
        description: 'Campo do tipo da ação realizada na tarefa',
    },
    taskId: {
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID da tarefa associada',
    },
    changedById: {
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID do usuário que realizou a alteração',
    },
};
