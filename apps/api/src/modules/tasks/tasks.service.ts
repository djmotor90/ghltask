import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    const payload: Prisma.TaskUncheckedCreateInput = {
      ...data,
      organization_id: orgId,
      list_id: listId,
      created_by: userId,
      custom_fields: (data.custom_fields as Prisma.InputJsonValue) ?? {},
    };

    if (data.assigned_to) {
      payload.assigned_to = data.assigned_to;
    }

    return this.prisma.task.create({ data: payload, include: { assignee: true } });
  }

  async updateTask(taskId: string, data: UpdateTaskDto) {
    const payload: Prisma.TaskUncheckedUpdateInput = {
      ...data,
      custom_fields: data.custom_fields as Prisma.InputJsonValue,
    };

    if (data.assigned_to !== undefined) {
      payload.assigned_to = data.assigned_to;
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: payload,
      include: { assignee: true },
    });
  }

  async deleteTask(taskId: string) {
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
