import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskControllerSwagger } from '../common/constants/task-controller-swagger.constants';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @ApiOperation(TaskControllerSwagger.create.operation)
  @ApiResponse(TaskControllerSwagger.create.responses)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation(TaskControllerSwagger.listByUser.operation)
  @ApiResponse(TaskControllerSwagger.listByUser.responses)
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Task[]> {
    return this.taskService.findByUserId(userId);
  }

  @ApiOperation(TaskControllerSwagger.findOne.operation)
  @ApiParam(TaskControllerSwagger.findOne.param)
  @ApiResponse(TaskControllerSwagger.findOne.responses)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @ApiOperation(TaskControllerSwagger.update.operation)
  @ApiParam(TaskControllerSwagger.update.param)
  @ApiResponse(TaskControllerSwagger.update.responses)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @ApiOperation(TaskControllerSwagger.remove.operation)
  @ApiParam(TaskControllerSwagger.remove.param)
  @ApiResponse(TaskControllerSwagger.remove.responses)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Task> {
    return this.taskService.remove(id);
  }
}
