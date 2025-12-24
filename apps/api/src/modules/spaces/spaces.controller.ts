import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgId } from '../../common/decorators/user.decorator';

@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpacesController {
  constructor(private readonly service: SpacesService) {}

  @Get()
  async getSpaces(@OrgId() orgId: string) {
    return this.service.getSpaces(orgId);
  }

  @Post()
  async createSpace(@OrgId() orgId: string, @Body() data: any) {
    return this.service.createSpace(orgId, data);
  }
}
