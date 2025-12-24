import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  async getFolders(spaceId: string) {
    return this.prisma.folder.findMany({
      where: { space_id: spaceId },
    });
  }

  async createFolder(spaceId: string, orgId: string, data: any) {
    return this.prisma.folder.create({
      data: {
        ...data,
        space_id: spaceId,
        organization_id: orgId,
      },
    });
  }
}
