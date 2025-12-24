import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  async getAttachments(taskId: string) {
    return this.prisma.attachment.findMany({
      where: { task_id: taskId },
    });
  }

  async createAttachment(taskId: string, userId: string, data: any) {
    return this.prisma.attachment.create({
      data: {
        ...data,
        task_id: taskId,
        uploaded_by: userId,
      },
    });
  }
}
