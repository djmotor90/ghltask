import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getUsersByOrg(orgId: string) {
    return this.prisma.user.findMany({
      where: { organization_id: orgId },
    });
  }
}
