import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';
import { TaskHistory } from '../../task-history/entities/task-history.entity';



export const TaskHistoryControllerSwagger: {
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
    listByTask: {
        operation: { summary: 'Listar todos os históricos de alterações da tarefa' } as ApiOperationOptions,
        responses: [
            { status: 200, description: 'Lista de históricos da tarefa retornada com sucesso', type: [TaskHistory] }
        ] as ApiResponseOptions
    },
    findOne: {
        operation: { summary: 'Obter um histórico pelo ID' } as ApiOperationOptions,
        param: { name: 'id', example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID do histórico' },
        responses: [
            { status: 200, description: 'Histórico encontrado', type: TaskHistory },
            { status: 404, description: 'Histórico não encontrado' }
        ] as ApiResponseOptions
    },
    remove: {
        operation: { summary: 'Remover um histórico pelo ID' } as ApiOperationOptions,
        param: { name: 'id', example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID do histórico' },
        responses: [
            { status: 200, description: 'Histórico removido com sucesso' },
            { status: 404, description: 'Histórico não encontrado' }
        ] as ApiResponseOptions
    }
};



