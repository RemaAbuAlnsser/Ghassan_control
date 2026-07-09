import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MaxLength(100)
  sku: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  wholesalePriceWestBank: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  wholesalePriceIsrael: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  hasWarranty?: boolean;

  @Type(() => Number)
  @IsInt()
  companyId: number;

  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  subcategoryId?: number;
}
