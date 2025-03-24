import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';
import { TaskMessage } from '../../task-message/entities/task-message.entity';



export const TaskMessageControllerSwagger: {
    [x: string]: {
        operation: ApiOperationOptions;
        responses: ApiResponseOptions;
        param?: {
            name: string;
            example: string;
            description: string;
        };
    };
} = {
    create: {
        operation: { summary: 'Criar uma nova mensagem de tarefa' } as ApiOperationOptions,
        responses: [
            { status: 201, description: 'Mensagem criada com sucesso', type: TaskMessage }
        ] as ApiResponseOptions
    },
    listByTask: {
        operation: { summary: 'Listar todas as mensagens de uma tarefa' } as ApiOperationOptions,
        responses: [
            { status: 200, description: 'Lista de mensagens retornada com sucesso', type: [TaskMessage] }
        ] as ApiResponseOptions
    },
    findOne: {
        operation: { summary: 'Obter uma mensagem pelo ID' } as ApiOperationOptions,
        param: { name: 'id', example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da mensagem' },
        responses: [
            { status: 200, description: 'Mensagem encontrada', type: TaskMessage },
            { status: 404, description: 'Mensagem não encontrada' }
        ] as ApiResponseOptions
    },
    update: {
        operation: { summary: 'Atualizar uma mensagem pelo ID' } as ApiOperationOptions,
        param: { name: 'id', example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da mensagem' },
        responses: [
            { status: 200, description: 'Mensagem atualizada com sucesso', type: TaskMessage },
            { status: 404, description: 'Mensagem não encontrada' }
        ] as ApiResponseOptions
    },
    remove: {
        operation: { summary: 'Remover uma mensagem pelo ID' } as ApiOperationOptions,
        param: { name: 'id', example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da mensagem' },
        responses: [
            { status: 200, description: 'Mensagem removida com sucesso' },
            { status: 404, description: 'Mensagem não encontrada' }
        ] as ApiResponseOptions
    }
};
