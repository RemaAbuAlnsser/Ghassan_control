import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MerchantJwtPayload } from '../interfaces/merchant-jwt-payload.interface';

export const CurrentMerchant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): MerchantJwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
