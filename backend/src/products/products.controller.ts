import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createImageUploadOptions } from '../common/image-upload.options';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MerchantAuthGuard } from '../auth/guards/merchant-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CurrentMerchant } from '../auth/decorators/current-merchant.decorator';
import type { MerchantJwtPayload } from '../auth/interfaces/merchant-jwt-payload.interface';

const imageUploadOptions = createImageUploadOptions('./uploads/products');

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = image ? `/uploads/products/${image.filename}` : undefined;
    return this.productsService.create(createProductDto, imagePath);
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('public')
  findAllPublic() {
    return this.productsService.findAllPublic();
  }

  @UseGuards(MerchantAuthGuard)
  @Get('merchant')
  findAllForMerchant(@CurrentMerchant() merchant: MerchantJwtPayload) {
    return this.productsService.findAllForMerchant(merchant.region);
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = image ? `/uploads/products/${image.filename}` : undefined;
    return this.productsService.update(id, updateProductDto, imagePath);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
