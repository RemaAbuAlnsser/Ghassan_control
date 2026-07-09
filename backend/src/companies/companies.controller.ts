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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

const imageUploadOptions = createImageUploadOptions('./uploads/companies');

@UseGuards(AdminAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = image ? `/uploads/companies/${image.filename}` : undefined;
    return this.companiesService.create(createCompanyDto, imagePath);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imagePath = image ? `/uploads/companies/${image.filename}` : undefined;
    return this.companiesService.update(id, updateCompanyDto, imagePath);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }
}
