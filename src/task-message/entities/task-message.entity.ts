import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskMessageSwagger } from '../../common/constants/task-message-swagger.constants';
import { Task } from '../../task/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class TaskMessage {
    @ApiProperty(TaskMessageSwagger.id)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty(TaskMessageSwagger.task)
    @ManyToOne(() => Task, (task) => task.id)
    task: Task;

    @ApiProperty(TaskMessageSwagger.author)
    @ManyToOne(() => User, (user) => user.id)
    author: User;

    @ApiProperty(TaskMessageSwagger.message)
    @Column('text')
    message: string;

    @ApiProperty(TaskMessageSwagger.createdAt)
    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    createdAt: Date;
}
