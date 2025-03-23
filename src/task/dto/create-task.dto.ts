import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskSwagger } from '../../common/constants/task-swagger.constants';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskType } from '../../common/enums/task-type.enum';

export class CreateTaskDto {
    @ApiProperty(TaskSwagger.title)
    @IsString()
    title: string;

    @ApiProperty(TaskSwagger.description)
    @IsString()
    description: string;

    @ApiProperty({
        ...TaskSwagger.status,
        enum: TaskStatus, // Aplicando enum TaskStatus
    })
    @IsString()
    status?: TaskStatus;

    @ApiPropertyOptional(TaskSwagger.assign)
    @IsOptional()
    @IsUUID()
    assign?: string;

    @ApiProperty({
        ...TaskSwagger.type,
        enum: TaskType, // Aplicando enum TaskType
    })
    @IsString()
    type: TaskType;

    @ApiProperty({
        ...TaskSwagger.priority,
        enum: TaskPriority, // Aplicando enum TaskPriority
    })
    @IsString()
    priority?: TaskPriority;

    @ApiPropertyOptional(TaskSwagger.dueDate)
    @IsOptional()
    @IsISO8601()
    dueDate?: string;

    @ApiPropertyOptional(TaskSwagger.completedAt)
    @IsOptional()
    @IsISO8601()
    completedAt?: string;
}
