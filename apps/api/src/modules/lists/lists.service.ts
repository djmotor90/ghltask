import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async getListsByFolder(folderId: string) {
    return this.prisma.list.findMany({
      where: { folder_id: folderId },
    });
  }

  async createList(folderId: string, orgId: string, data: any) {
    return this.prisma.list.create({
      data: {
        ...data,
        folder_id: folderId,
        organization_id: orgId,
      },
    });
  }
}
