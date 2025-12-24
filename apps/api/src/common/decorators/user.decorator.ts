import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JWTPayload } from '@ghl-task/types';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JWTPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const OrgId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.organization_id;
  },
);
