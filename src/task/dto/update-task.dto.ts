import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskSwagger } from '../../common/constants/task-swagger.constants';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskType } from '../../common/enums/task-type.enum';

export class UpdateTaskDto {
    @ApiPropertyOptional(TaskSwagger.title)
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional(TaskSwagger.description)
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        ...TaskSwagger.status,
        enum: TaskStatus, // Aplicando enum TaskStatus
    })
    @IsOptional()
    @IsString()
    status?: TaskStatus;

    @ApiPropertyOptional({
        ...TaskSwagger.type,
        enum: TaskType, // Aplicando enum TaskType
    })
    @IsOptional()
    @IsString()
    type?: TaskType;

    @ApiPropertyOptional({
        ...TaskSwagger.priority,
        enum: TaskPriority, // Aplicando enum TaskPriority
    })
    @IsOptional()
    @IsString()
    priority?: TaskPriority;

    @ApiPropertyOptional(TaskSwagger.assign)
    @IsOptional()
    @IsUUID()
    assign?: string;

    @ApiPropertyOptional(TaskSwagger.dueDate)
    @IsOptional()
    @IsISO8601()
    dueDate?: string;

    @ApiPropertyOptional(TaskSwagger.completedAt)
    @IsOptional()
    @IsISO8601()
    completedAt?: string;
}
