import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JWTPayload, CreateCommentDto } from '@ghl-task/types';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Get()
  async getComments(@Param('taskId') taskId: string) {
    return this.service.getComments(taskId);
  }

  @Post()
  async createComment(
    @Param('taskId') taskId: string,
    @CurrentUser() user: JWTPayload,
    @Body() data: CreateCommentDto,
  ) {
    return this.service.createComment(taskId, user.sub, data);
  }
}
