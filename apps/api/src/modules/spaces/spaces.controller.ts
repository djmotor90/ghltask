import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
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

  @Get(':id')
  async getSpace(@OrgId() orgId: string, @Param('id') id: string) {
    return this.service.getSpace(orgId, id);
  }

  @Post()
  async createSpace(@OrgId() orgId: string, @Body() data: any) {
    return this.service.createSpace(orgId, data);
  }
}
