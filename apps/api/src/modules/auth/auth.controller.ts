import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JWTPayload } from '@ghl-task/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('authorize')
  authorize(): { url: string } {
    const url = this.authService.getGHLAuthUrl();
    return { url };
  }

  @Get('callback')
  async callback(@Query('code') code: string): Promise<{ accessToken: string; user: any }> {
    try {
      console.log(`[Auth] Handling OAuth callback with code: ${code}`);
      const result = await this.authService.handleOAuthCallback(code);
      console.log(`[Auth] OAuth callback successful for user: ${result.user.email}`);
      return result;
    } catch (error) {
      console.error(`[Auth] OAuth callback failed:`, error);
      throw error;
    }
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
