import { Task } from '../../task/entities/task.entity';
import { mockUser } from '../../users/mocks/mockUser';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskType } from '../enums/task-type.enum';

export const mockTask: Task = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Corrigir bug no login",
    description: "O sistema não está validando corretamente os tokens de autenticação.",
    status: TaskStatus.TODO,
    assign: mockUser,
    type: TaskType.TASK,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date("2025-03-25T18:00:00.000Z"),
    completedAt: null,
    createdAt: new Date("2025-03-20T14:30:00.000Z"),
    updatedAt: null
};
