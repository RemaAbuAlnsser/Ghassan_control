import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MerchantLoginDto } from './dto/merchant-login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('merchant/login')
  @HttpCode(HttpStatus.OK)
  loginMerchant(@Body() dto: MerchantLoginDto) {
    return this.authService.loginMerchant(dto.phone, dto.password);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  loginAdmin(@Body() dto: AdminLoginDto) {
    return this.authService.loginAdmin(dto.username, dto.password);
  }
}
