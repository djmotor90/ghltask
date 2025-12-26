import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ListsService } from './lists.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, OrgId } from '../../common/decorators/user.decorator';
import { JWTPayload } from '@ghl-task/types';

@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListsController {
  constructor(private readonly service: ListsService) {}

  @Get('space/:spaceId')
  async getBySpace(@Param('spaceId') spaceId: string) {
    return this.service.getListsBySpace(spaceId);
  }

  @Get(':listId')
  async getById(@Param('listId') listId: string) {
    return this.service.getListById(listId);
  }

  @Post('space/:spaceId')
  async createInSpace(
    @Param('spaceId') spaceId: string,
    @OrgId() orgId: string,
    @CurrentUser() user: JWTPayload,
    @Body() data: any,
  ) {
    return this.service.createListInSpace(spaceId, orgId, user.sub, data);
  }

  @Post('folder/:folderId')
  async createInFolder(
    @Param('folderId') folderId: string,
    @OrgId() orgId: string,
    @CurrentUser() user: JWTPayload,
    @Body() data: any,
  ) {
    return this.service.createList(folderId, orgId, user.sub, data);
  }
}
