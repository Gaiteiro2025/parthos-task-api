import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { appDataSource } from './ormconfig';
import { TaskHistoryModule } from './task-history/task-history.module';
import { TaskMessageModule } from './task-message/task-message.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(appDataSource.options),
    AuthModule,
    TaskModule,
    TaskHistoryModule,
    TaskMessageModule
  ],
  providers: [ConfigService],
})
export class AppModule { }
