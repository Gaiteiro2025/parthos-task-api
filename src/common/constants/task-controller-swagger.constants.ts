import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';
import { Task } from '../../task/entities/task.entity';

export const TaskControllerSwagger: {
    [x: string]: {
        operation: ApiOperationOptions;
        responses: ApiResponseOptions;
        param?: {
            name: string;
            example: string;
            description: string;
        };
    }
} = {
    create: {
        operation: { summary: 'Criar uma nova tarefa' } as ApiOperationOptions,
        responses: [
            { status: 201, description: 'Tarefa criada com sucesso', type: Task },
            { status: 400, description: 'Requisição inválida' }
        ] as ApiResponseOptions
    },
    listByUser: {
        operation: { summary: 'Listar todas as tarefas de um usuário' } as ApiOperationOptions,
        responses: [
            { status: 200, description: 'Lista de tarefas retornada com sucesso', type: [Task] },
            { status: 404, description: 'Usuário não encontrado' }
        ] as ApiResponseOptions
    },
    findOne: {
        operation: { summary: 'Obter uma tarefa pelo ID' } as ApiOperationOptions,
        param: { name: 'id', example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da tarefa' },
        responses: [
            { status: 200, description: 'Tarefa encontrada', type: Task },
            { status: 404, description: 'Tarefa não encontrada' }
        ] as ApiResponseOptions
    },
    update: {
        operation: { summary: 'Atualizar uma tarefa pelo ID' } as ApiOperationOptions,
        param: { name: 'id', example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da tarefa' },
        responses: [
            { status: 200, description: 'Tarefa atualizada com sucesso', type: Task },
            { status: 404, description: 'Tarefa não encontrada' }
        ] as ApiResponseOptions
    },
    remove: {
        operation: { summary: 'Remover uma tarefa pelo ID' } as ApiOperationOptions,
        param: { name: 'id', example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da tarefa' },
        responses: [
            { status: 200, description: 'Tarefa removida com sucesso' },
            { status: 404, description: 'Tarefa não encontrada' }
        ] as ApiResponseOptions
    }
};

