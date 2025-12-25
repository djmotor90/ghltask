import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JWTPayload, GHLTokenResponse, GHLUser } from '@ghl-task/types';

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private http(): AxiosInstance {
    return axios.create({
      timeout: 20000,
      headers: {
        Version: GHL_API_VERSION,
      },
    });
  }

  getGHLAuthUrl(): string {
    const clientId = this.configService.get('GHL_CLIENT_ID');
    const redirectUri = this.configService.get('GHL_REDIRECT_URI');
    const scopes = this.configService.get('GHL_SCOPES') || 'locations.readonly users.readonly oauth.readonly';
    const state = Math.random().toString(36).substring(7);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      state,
    });

    this.logger.log('[OAuth] Generating auth URL', { clientId, redirectUri, scopes });

    return `https://marketplace.gohighlevel.com/oauth/chooselocation?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<GHLTokenResponse> {
    const clientId = this.configService.get('GHL_CLIENT_ID');
    const clientSecret = this.configService.get('GHL_CLIENT_SECRET');
    const redirectUri = this.configService.get('GHL_REDIRECT_URI');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
      user_type: 'Company',
    });

    this.logger.log('[OAuth] Exchanging code for token', {
      endpoint: `${GHL_BASE}/oauth/token`,
      clientId,
      redirectUri,
      codeLength: code?.length,
    });

    try {
      const response = await this.http().post(
        `${GHL_BASE}/oauth/token`,
        body.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.logger.log('[OAuth] Token exchange successful', {
        userId: response.data.userId,
        companyId: response.data.companyId,
        locationId: response.data.locationId,
        scope: response.data.scope,
      });

      return response.data;
    } catch (error) {
      const r = error?.response;
      this.logger.error('[OAuth] Token exchange failed', {
        status: r?.status,
        statusText: r?.statusText,
        data: r?.data,
        message: error?.message,
      });
      throw new Error(
        `Failed to exchange code for token: ${r?.status ?? 'unknown'} ${JSON.stringify(r?.data ?? error?.message)}`,
      );
    }
  }

  async getGHLUser(accessToken: string, userId: string): Promise<GHLUser> {
    try {
      const response = await this.http().get(
        `${GHL_BASE}/users/${encodeURIComponent(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      const r = error?.response;
      this.logger.error('[OAuth] Failed to fetch GHL user', {
        status: r?.status,
        statusText: r?.statusText,
        data: r?.data,
        message: error?.message,
      });
      throw new Error(
        `Failed to fetch GHL user: ${r?.status ?? 'unknown'} ${JSON.stringify(r?.data ?? error?.message)}`,
      );
    }
  }

  async getGHLLocation(accessToken: string, locationId: string): Promise<any> {
    try {
      const response = await this.http().get(
        `${GHL_BASE}/locations/${encodeURIComponent(locationId)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      const r = error?.response;
      this.logger.error('[OAuth] Failed to fetch GHL location', {
        status: r?.status,
        statusText: r?.statusText,
        data: r?.data,
        message: error?.message,
      });
      throw new Error(
        `Failed to fetch GHL location: ${r?.status ?? 'unknown'} ${JSON.stringify(r?.data ?? error?.message)}`,
      );
    }
  }

  async handleOAuthCallback(code: string): Promise<{ accessToken: string; user: any }> {
    // Exchange code for GHL token
    const ghlToken = await this.exchangeCodeForToken(code);

    const ghlAccessToken = ghlToken.access_token;
    const userId = ghlToken.userId;
    const locationId = ghlToken.locationId;

    if (!userId) {
      throw new Error('Token response missing userId');
    }
    if (!locationId) {
      throw new Error('Token response missing locationId');
    }

    // Fetch user and location details
    const [ghlUser, ghlLocation] = await Promise.all([
      this.getGHLUser(ghlAccessToken, userId),
      this.getGHLLocation(ghlAccessToken, locationId),
    ]);

    // Find or create organization (using locationId as the account identifier)
    let organization = await this.prisma.organization.findUnique({
      where: { ghl_account_id: locationId },
    });

    const isNewOrganization = !organization;

    if (!organization) {
      organization = await this.prisma.organization.create({
        data: {
          ghl_account_id: locationId,
          name: ghlLocation.name || ghlLocation.companyName || 'Organization',
          planType: 'free',
          status: 'active',
          ghl_access_token: ghlToken.access_token,
          ghl_refresh_token: ghlToken.refresh_token,
          ghl_token_expires: new Date(Date.now() + ghlToken.expires_in * 1000),
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
    }

    // Create default space for new organizations
    if (isNewOrganization) {
      await this.prisma.space.create({
        data: {
          organization_id: organization.id,
          name: 'Default',
          created_by: user.id,
        },
      });
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
