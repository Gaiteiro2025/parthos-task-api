import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskHistory } from '../task-history/entities/task-history.entity';
import { TaskHistoryModule } from '../task-history/task-history.module';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskHistory, User]),
    TaskHistoryModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule { }
