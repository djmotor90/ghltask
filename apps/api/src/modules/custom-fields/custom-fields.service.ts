import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CustomFieldsService {
  constructor(private prisma: PrismaService) {}

  async getCustomFields(listId: string) {
    return this.prisma.customField.findMany({
      where: { list_id: listId },
    });
  }

  async createCustomField(listId: string, orgId: string, data: any) {
    return this.prisma.customField.create({
      data: {
        ...data,
        list_id: listId,
        organization_id: orgId,
      },
    });
  }
}
