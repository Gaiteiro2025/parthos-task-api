import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskHistory } from '../task-history/entities/task-history.entity';
import { TaskHistoryModule } from '../task-history/task-history.module';
import { Task } from '../task/entities/task.entity';
import { TaskModule } from '../task/task.module';
import { User } from '../users/entities/user.entity';
import { TaskMessage } from './entities/task-message.entity';
import { TaskMessageController } from './task-message.controller';
import { TaskMessageService } from './task-message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskMessage, Task, TaskHistory, User]),
    TaskHistoryModule,
    TaskModule
  ],
  controllers: [TaskMessageController],
  providers: [TaskMessageService],
})
export class TaskMessageModule { }
