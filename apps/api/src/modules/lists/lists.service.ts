import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async getListsByFolder(folderId: string) {
    return this.prisma.list.findMany({
      where: { folder_id: folderId },
      include: { tasks: true },
    });
  }

  async getListsBySpace(spaceId: string) {
    return this.prisma.list.findMany({
      where: { space_id: spaceId },
      include: {
        tasks: {
          include: {
            assignee: true,
          },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  async getListById(listId: string) {
    return this.prisma.list.findUnique({
      where: { id: listId },
      include: {
        tasks: {
          include: {
            assignee: true,
          },
        },
      },
    });
  }

  async createList(folderId: string, orgId: string, userId: string, data: any) {
    return this.prisma.list.create({
      data: {
        ...data,
        folder_id: folderId,
        organization_id: orgId,
        created_by: userId,
      },
    });
  }

  async createListInSpace(spaceId: string, orgId: string, userId: string, data: any) {
    return this.prisma.list.create({
      data: {
        ...data,
        space_id: spaceId,
        organization_id: orgId,
        created_by: userId,
      },
    });
  }
}
