import { Task } from "../../task/entities/task.entity";
import { User } from "../../users/entities/user.entity";

export const TaskMessageSwagger = {
    id: {
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID da mensagem',
    },
    task: {
        description: 'Tarefa associada à mensagem',
        type: () => Task,
    },
    author: {
        description: 'Usuário que escreveu a mensagem',
        type: () => User,
    },
    message: {
        example: 'Isso precisa ser revisado.',
        description: 'Conteúdo da mensagem',
    },
    createdAt: {
        example: '2025-03-20T14:00:00.000Z',
        description: 'Data de criação da mensagem',
    },
};
export class CreateTaskMessageSwagger {
    static taskId = {
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID da tarefa associada',
    };

    static authorId = {
        example: '550e8400-e29b-41d4-a716-446655440001',
        description: 'ID do autor da mensagem',
    };

    static message = {
        example: 'Isso precisa ser revisado.',
        description: 'Conteúdo da mensagem',
    };
}

export class UpdateTaskMessageSwagger {
    static message = {
        example: 'Mensagem atualizada.',
        description: 'Novo conteúdo da mensagem',
        required: false,
    };
}