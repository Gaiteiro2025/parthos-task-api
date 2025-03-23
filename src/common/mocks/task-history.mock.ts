import { TaskHistory } from '../../task-history/entities/task-history.entity';
import { mockUser } from '../../users/mocks/mockUser';
import { TaskHistoryAction } from '../enums/task-history-action.enum';
import { mockTask } from './task.mock';

export const mockTaskHistory: TaskHistory = {
    id: '1', task: mockTask, action: TaskHistoryAction.CREATED,
    changedBy: mockUser,
    fieldChanged: '',
    oldValue: '',
    newValue: '',
    createdAt: new Date()
};
