import { MerchantRegion } from '../../merchants/entities/merchant.entity';

export interface MerchantJwtPayload {
  sub: number;
  phone: string;
  region: MerchantRegion;
  type: 'merchant';
}
