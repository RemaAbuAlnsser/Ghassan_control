import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { createImageUploadOptions } from '../common/image-upload.options';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

const imageUploadOptions = createImageUploadOptions('./uploads/settings');

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() {
    return this.settingsService.get();
  }

  @UseGuards(AdminAuthGuard)
  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'favicon', maxCount: 1 },
      ],
      imageUploadOptions,
    ),
  )
  update(
    @Body() dto: UpdateSettingsDto,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; favicon?: Express.Multer.File[] },
  ) {
    const logoPath = files.logo?.[0] ? `/uploads/settings/${files.logo[0].filename}` : undefined;
    const faviconPath = files.favicon?.[0]
      ? `/uploads/settings/${files.favicon[0].filename}`
      : undefined;
    return this.settingsService.update(dto, logoPath, faviconPath);
  }
}
