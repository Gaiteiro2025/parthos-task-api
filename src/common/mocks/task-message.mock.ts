import { TaskMessage } from '../../task-message/entities/task-message.entity';
import { mockUser } from '../../users/mocks/mockUser';
import { mockTask } from './task.mock';

export const mockTaskMessage: TaskMessage = {
    id: '1', message: 'Message 1', task: mockTask, createdAt: new Date(),
    author: mockUser
};
