import { IsString } from 'class-validator';

export class MerchantLoginDto {
  @IsString()
  phone: string;

  @IsString()
  password: string;
}
