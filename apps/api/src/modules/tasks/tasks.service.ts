import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from '@ghl-task/types';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasksByList(listId: string) {
    return this.prisma.task.findMany({
      where: { list_id: listId },
      include: {
        assignee: true,
        comments: true,
        subtasks: true,
      },
    });
  }

  async getTaskById(taskId: string) {
    return this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: true,
        comments: { include: { user: true } },
        subtasks: true,
        relationships: true,
        attachments: true,
      },
    });
  }

  async createTask(orgId: string, listId: string, userId: string, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...data,
        organization_id: orgId,
        list_id: listId,
        created_by: userId,
      },
      include: { assignee: true },
    });
  }

  async updateTask(taskId: string, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id: taskId },
      data,
      include: { assignee: true },
    });
  }

  async deleteTask(taskId: string) {
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
