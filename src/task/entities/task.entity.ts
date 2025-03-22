import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskSwagger } from '../../common/constants/task-swagger.constants';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskType } from '../../common/enums/task-type.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
    @ApiProperty(TaskSwagger.id)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty(TaskSwagger.title)
    @Column()
    title: string;

    @ApiProperty(TaskSwagger.description)
    @Column()
    description: string;

    @ApiProperty(TaskSwagger.status)
    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @ApiProperty(TaskSwagger.assign)
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn()
    assign: User;

    @ApiProperty(TaskSwagger.type)
    @Column({ type: 'enum', enum: TaskType, default: TaskType.TASK })
    type: TaskType;

    @ApiProperty(TaskSwagger.priority)
    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;

    @ApiProperty(TaskSwagger.dueDate)
    @Column({ type: 'timestamptz', nullable: true })
    dueDate: Date;

    @ApiProperty(TaskSwagger.completedAt)
    @Column({ type: 'timestamptz' })
    completedAt: Date;

    @ApiProperty(TaskSwagger.createdAt)
    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    createdAt: Date;

    @ApiProperty(TaskSwagger.updatedAt)
    @Column({ type: 'timestamptz', default: () => 'NOW()', onUpdate: 'NOW()' })
    updatedAt: Date;
}