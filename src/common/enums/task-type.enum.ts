export enum TaskType {
    TASK = 'TASK',
    BUG = 'BUG',
    FEATURE = 'FEATURE',
    IMPROVEMENT = 'IMPROVEMENT',
    EPIC = 'EPIC',
}

export const TaskHierarchy: Record<TaskType, TaskType | null> = {
    [TaskType.TASK]: null,
    [TaskType.BUG]: TaskType.TASK,
    [TaskType.FEATURE]: TaskType.EPIC,
    [TaskType.IMPROVEMENT]: TaskType.FEATURE,
    [TaskType.EPIC]: null,
};

/*
export const isValidHierarchy = (child: TaskType, parent: TaskType): boolean => {
    let current = TaskHierarchy[child];
    while (current) {
        if (current === parent) return true;
        current = TaskHierarchy[current];
    }
    return false;
};
*/