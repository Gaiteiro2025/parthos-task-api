import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskHistorySwagger } from '../../common/constants/task-history-swagger.constants';
import { TaskHistoryAction } from '../../common/enums/task-history-action.enum';
import { Task } from '../../task/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class TaskHistory {
    @ApiProperty(TaskHistorySwagger.id)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty(TaskHistorySwagger.task)
    @ManyToOne(() => Task)
    @JoinColumn()
    task: Task;

    @ApiProperty(TaskHistorySwagger.changedBy)
    @ManyToOne(() => User)
    @JoinColumn()
    changedBy: User;

    @ApiProperty(TaskHistorySwagger.fieldChanged)
    @Column({ nullable: true })
    fieldChanged: string;

    @ApiProperty(TaskHistorySwagger.oldValue)
    @Column({ nullable: true })
    oldValue: string;

    @ApiProperty(TaskHistorySwagger.newValue)
    @Column({ nullable: true })
    newValue: string;

    @ApiProperty(TaskHistorySwagger.createdAt)
    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty(TaskHistorySwagger.action)
    @Column({
        type: 'enum',
        enum: TaskHistoryAction,
    })
    action: TaskHistoryAction
}
