import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgId } from '../../common/decorators/user.decorator';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get('me')
  async getProfile(@OrgId() orgId: string) {
    return this.service.getOrgProfile(orgId);
  }

  @Get('members')
  async getMembers(@OrgId() orgId: string) {
    return this.service.getOrgMembers(orgId);
  }
}
