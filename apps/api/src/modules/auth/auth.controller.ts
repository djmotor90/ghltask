import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JWTPayload } from '@ghl-task/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ghl/authorize')
  ghlAuthorize(): { url: string } {
    const url = this.authService.getGHLAuthUrl();
    return { url };
  }

  @Get('ghl/callback')
  async ghlCallback(@Query('code') code: string): Promise<{ accessToken: string; user: any }> {
    return this.authService.handleOAuthCallback(code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() user: JWTPayload): JWTPayload {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  refreshToken(@CurrentUser() user: JWTPayload): { accessToken: string } {
    // Generate new tokens
    const { accessToken } = this.authService.generateTokens(user);
    return { accessToken };
  }
}
