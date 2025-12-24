import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getComments(taskId: string) {
    return this.prisma.comment.findMany({
      where: { task_id: taskId },
      include: { user: true },
    });
  }

  async createComment(taskId: string, userId: string, data: any) {
    return this.prisma.comment.create({
      data: {
        ...data,
        task_id: taskId,
        user_id: userId,
      },
      include: { user: true },
    });
  }
}
