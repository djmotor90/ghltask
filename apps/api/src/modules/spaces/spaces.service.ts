import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  async getSpaces(orgId: string) {
    return this.prisma.space.findMany({
      where: { organization_id: orgId },
      include: { folders: true },
    });
  }

  async getSpace(orgId: string, id: string) {
    return this.prisma.space.findFirst({
      where: { organization_id: orgId, id },
      include: { folders: true, lists: true },
    });
  }

  async createSpace(orgId: string, data: any) {
    return this.prisma.space.create({
      data: {
        ...data,
        organization_id: orgId,
      },
    });
  }
}
