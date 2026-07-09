import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createImageUploadOptions } from '../common/image-upload.options';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

const imageUploadOptions = createImageUploadOptions('./uploads/subcategories');

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() createSubcategoryDto: CreateSubcategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = image
      ? `/uploads/subcategories/${image.filename}`
      : undefined;
    return this.subcategoriesService.create(createSubcategoryDto, imagePath);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = image
      ? `/uploads/subcategories/${image.filename}`
      : undefined;
    return this.subcategoriesService.update(
      id,
      updateSubcategoryDto,
      imagePath,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoriesService.remove(id);
  }
}
