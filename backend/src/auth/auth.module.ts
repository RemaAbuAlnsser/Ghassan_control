import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MerchantJwtStrategy } from './strategies/merchant-jwt.strategy';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { MerchantsModule } from '../merchants/merchants.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MerchantsModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '7d') as `${number}d`,
        },
      }),
    }),
  ],
  providers: [AuthService, MerchantJwtStrategy, AdminJwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
