import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getOrgProfile(orgId: string) {
    return this.prisma.organization.findUnique({
      where: { id: orgId },
    });
  }

  async getOrgMembers(orgId: string) {
    return this.prisma.user.findMany({
      where: { organization_id: orgId, is_active: true },
    });
  }
}
