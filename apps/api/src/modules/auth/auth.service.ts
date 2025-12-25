import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JWTPayload, GHLTokenResponse, GHLUser } from '@ghl-task/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  getGHLAuthUrl(): string {
    const clientId = this.configService.get('GHL_CLIENT_ID');
    const redirectUri = this.configService.get('GHL_REDIRECT_URI');

    const state = Math.random().toString(36).substring(7);

    console.log('[OAuth] Generating auth URL', { clientId, redirectUri });

    return `https://marketplace.gohighlevel.com/oauth/chooselocation?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
  }

  async exchangeCodeForToken(code: string): Promise<GHLTokenResponse> {
    const clientId = this.configService.get('GHL_CLIENT_ID');
    const clientSecret = this.configService.get('GHL_CLIENT_SECRET');
    const redirectUri = this.configService.get('GHL_REDIRECT_URI');

    console.log('[OAuth] Exchanging code for token', {
      endpoint: 'https://services.leadconnectorhq.com/oauth/token',
      clientId,
      redirectUri,
      codeLength: code?.length,
    });

    try {
      const response = await axios.post(
        'https://services.leadconnectorhq.com/oauth/token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          user_type: 'Company',
        },
      );

      console.log('[OAuth] Token exchange successful');
      return response.data;
    } catch (error) {
      console.error('[OAuth] Token exchange failed', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });
      throw new Error(`Failed to exchange code for token: ${error?.response?.status} ${JSON.stringify(error?.response?.data)}`);
    }
  }

  async getGHLUser(accessToken: string): Promise<GHLUser> {
    try {
      const response = await axios.get(
        'https://api.gohighlevel.com/v1/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch GHL user: ${error.message}`);
    }
  }

  async getGHLAccount(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(
        'https://api.gohighlevel.com/v1/businesses',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch GHL account: ${error.message}`);
    }
  }

  async handleOAuthCallback(code: string): Promise<{ accessToken: string; user: any }> {
    // Exchange code for GHL token
    const ghlToken = await this.exchangeCodeForToken(code);
    const ghlUser = await this.getGHLUser(ghlToken.access_token);
    const ghlAccount = await this.getGHLAccount(ghlToken.access_token);

    // Find or create organization
    let organization = await this.prisma.organization.findUnique({
      where: { ghl_account_id: ghlAccount.id },
    });

    if (!organization) {
      organization = await this.prisma.organization.create({
        data: {
          ghl_account_id: ghlAccount.id,
          name: ghlAccount.name,
          planType: 'free',
          status: 'active',
          ghl_access_token: ghlToken.access_token,
          ghl_refresh_token: ghlToken.refresh_token,
          ghl_token_expires: new Date(Date.now() + ghlToken.expires_in * 1000),
        },
      });

      // Create default space and folder
      await this.prisma.space.create({
        data: {
          organization_id: organization.id,
          name: 'Default',
          created_by: '', // Will be set after user creation
        },
      });
    } else {
      // Update tokens
      await this.prisma.organization.update({
        where: { id: organization.id },
        data: {
          ghl_access_token: ghlToken.access_token,
          ghl_refresh_token: ghlToken.refresh_token,
          ghl_token_expires: new Date(Date.now() + ghlToken.expires_in * 1000),
        },
      });
    }

    // Find or create user
    let user = await this.prisma.user.findFirst({
      where: {
        organization_id: organization.id,
        ghl_user_id: ghlUser.id,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          organization_id: organization.id,
          ghl_user_id: ghlUser.id,
          email: ghlUser.email,
          full_name: `${ghlUser.firstName || ''} ${ghlUser.lastName || ''}`.trim(),
          avatar_url: ghlUser.profileImageUrl,
          role: 'admin',
          is_active: true,
        },
      });

      // Update space creator
      const spaces = await this.prisma.space.findMany({
        where: { organization_id: organization.id },
      });

      for (const space of spaces) {
        if (!space.created_by) {
          await this.prisma.space.update({
            where: { id: space.id },
            data: { created_by: user.id },
          });
        }
      }
    }

    // Generate JWT
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      organization_id: organization.id,
      role: user.role as any,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        organization_id: organization.id,
      },
    };
  }

  generateTokens(user: any): { accessToken: string; refreshToken: string } {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      organization_id: user.organization_id,
      role: user.role as any,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15 * 60,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
