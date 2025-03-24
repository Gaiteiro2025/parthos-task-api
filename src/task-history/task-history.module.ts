import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskHistory } from './entities/task-history.entity';
import { TaskHistoryController } from './task-history.controller';
import { TaskHistoryService } from './task-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskHistory]),
  ],
  controllers: [TaskHistoryController],
  providers: [TaskHistoryService],
  exports: [TaskHistoryService]
})
export class TaskHistoryModule { }
