import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskHistoryControllerSwagger } from '../common/constants/task-history-controller-swagger.constants';
import { TaskHistory } from './entities/task-history.entity';
import { TaskHistoryService } from './task-history.service';

@ApiTags('Task History')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('task-history')
export class TaskHistoryController {
  constructor(private readonly taskHistoryService: TaskHistoryService) { }

  @ApiOperation(TaskHistoryControllerSwagger.listByTask.operation)
  @ApiResponse(TaskHistoryControllerSwagger.listByTask.responses)
  @Get('task/:taskId')
  findByTaskId(@Param('taskId') taskId: string): Observable<TaskHistory[]> {
    return this.taskHistoryService.findByTaskId(taskId);
  }

  @ApiOperation(TaskHistoryControllerSwagger.findOne.operation)
  @ApiParam(TaskHistoryControllerSwagger.findOne.param)
  @ApiResponse(TaskHistoryControllerSwagger.findOne.responses)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<TaskHistory> {
    return this.taskHistoryService.findOne(id);
  }

  @ApiOperation(TaskHistoryControllerSwagger.remove.operation)
  @ApiParam(TaskHistoryControllerSwagger.remove.param)
  @ApiResponse(TaskHistoryControllerSwagger.remove.responses)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.taskHistoryService.remove(id);
  }
}
