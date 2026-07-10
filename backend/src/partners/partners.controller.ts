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
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

const imageUploadOptions = createImageUploadOptions('./uploads/partners');

@UseGuards(AdminAuthGuard)
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() createPartnerDto: CreatePartnerDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = image ? `/uploads/partners/${image.filename}` : undefined;
    return this.partnersService.create(createPartnerDto, imagePath);
  }

  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = image ? `/uploads/partners/${image.filename}` : undefined;
    return this.partnersService.update(id, updatePartnerDto, imagePath);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.remove(id);
  }
}
