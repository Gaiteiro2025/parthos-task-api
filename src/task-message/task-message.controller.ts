import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskMessageControllerSwagger } from '../common/constants/task-message-controller-swagger.constants';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { UpdateTaskMessageDto } from './dto/update-task-message.dto';
import { TaskMessage } from './entities/task-message.entity';
import { TaskMessageService } from './task-message.service';

@ApiTags('Task Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('task-message')
export class TaskMessageController {
  constructor(private readonly taskMessageService: TaskMessageService) { }

  @ApiOperation(TaskMessageControllerSwagger.create.operation)
  @ApiResponse(TaskMessageControllerSwagger.create.responses)
  @Post()
  create(@Body() createTaskMessageDto: CreateTaskMessageDto): Promise<TaskMessage> {
    return this.taskMessageService.create(createTaskMessageDto);
  }

  @ApiOperation(TaskMessageControllerSwagger.listByTask.operation)
  @ApiResponse(TaskMessageControllerSwagger.listByTask.responses)
  @Get('task/:taskId')
  findByTaskId(@Param('taskId') taskId: string): Promise<TaskMessage[]> {
    return this.taskMessageService.findByTaskId(taskId);
  }

  @ApiOperation(TaskMessageControllerSwagger.findOne.operation)
  @ApiParam(TaskMessageControllerSwagger.findOne.param)
  @ApiResponse(TaskMessageControllerSwagger.findOne.responses)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<TaskMessage> {
    return this.taskMessageService.findOne(id);
  }

  @ApiOperation(TaskMessageControllerSwagger.update.operation)
  @ApiParam(TaskMessageControllerSwagger.update.param)
  @ApiResponse(TaskMessageControllerSwagger.update.responses)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskMessageDto: UpdateTaskMessageDto): Promise<TaskMessage> {
    return this.taskMessageService.update(id, updateTaskMessageDto);
  }

  @ApiOperation(TaskMessageControllerSwagger.remove.operation)
  @ApiParam(TaskMessageControllerSwagger.remove.param)
  @ApiResponse(TaskMessageControllerSwagger.remove.responses)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.taskMessageService.remove(id);
  }
}
