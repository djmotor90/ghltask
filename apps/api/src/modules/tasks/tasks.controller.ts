import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, OrgId } from '../../common/decorators/user.decorator';
import { JWTPayload, CreateTaskDto, UpdateTaskDto } from '@ghl-task/types';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get('list/:listId')
  async getTasksByList(@Param('listId') listId: string) {
    return this.service.getTasksByList(listId);
  }

  @Get(':taskId')
  async getTask(@Param('taskId') taskId: string) {
    return this.service.getTaskById(taskId);
  }

  @Post()
  async createTask(
    @OrgId() orgId: string,
    @Body() data: CreateTaskDto,
    @CurrentUser() user: JWTPayload,
  ) {
    return this.service.createTask(orgId, data.list_id, user.sub, data);
  }

  @Put(':taskId')
  async updateTask(@Param('taskId') taskId: string, @Body() data: UpdateTaskDto) {
    return this.service.updateTask(taskId, data);
  }

  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: string) {
    return this.service.deleteTask(taskId);
  }
}
