import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MerchantJwtPayload } from './interfaces/merchant-jwt-payload.interface';
import { AdminJwtPayload } from './interfaces/admin-jwt-payload.interface';
import { MerchantsService } from '../merchants/merchants.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly merchantsService: MerchantsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginMerchant(phone: string, password: string) {
    const merchant = await this.merchantsService.findByPhoneWithPassword(phone);

    if (!merchant) {
      throw new UnauthorizedException('رقم الهاتف أو كلمة السر غير صحيحة');
    }
    if (!merchant.isActive) {
      throw new UnauthorizedException('هذا الحساب معطل، تواصل مع الإدارة');
    }

    const passwordMatches = await bcrypt.compare(password, merchant.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('رقم الهاتف أو كلمة السر غير صحيحة');
    }

    const payload: MerchantJwtPayload = {
      sub: merchant.id,
      phone: merchant.phone,
      region: merchant.region,
      type: 'merchant',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      merchant: {
        id: merchant.id,
        name: merchant.name,
        phone: merchant.phone,
        region: merchant.region,
      },
    };
  }

  async loginAdmin(username: string, password: string) {
    const user = await this.usersService.findByUsernameWithPassword(username);

    if (!user) {
      throw new UnauthorizedException('اسم المستخدم أو كلمة السر غير صحيحة');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('اسم المستخدم أو كلمة السر غير صحيحة');
    }

    const payload: AdminJwtPayload = {
      sub: user.id,
      username: user.username,
      type: 'admin',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
