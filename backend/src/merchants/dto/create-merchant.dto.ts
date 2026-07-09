import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { MerchantRegion } from '../entities/merchant.entity';

export class CreateMerchantDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsString()
  @MaxLength(30)
  phone: string;

  @IsEnum(MerchantRegion)
  region: MerchantRegion;

  @IsString()
  @MinLength(6)
  password: string;
}
