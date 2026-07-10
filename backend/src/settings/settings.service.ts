import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Settings } from './entities/settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

const DEFAULT_HERO_DESCRIPTION =
  'نوفر حلولاً متكاملة لتجهيز المطاعم، المقاهي، السوبر ماركت، والمشاريع التجارية بأحدث المعدات وأعلى معايير الجودة.';
const DEFAULT_HERO_LOOP_WORDS =
  'جودة\nاحترافية\nاعتمادية\nحلول متكاملة\nمعدات احترافية\nأسعار منافسة';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async get(): Promise<Settings> {
    const existing = await this.settingsRepository.find({ take: 1 });
    if (existing.length > 0) return existing[0];

    const created = this.settingsRepository.create({
      heroDescription: DEFAULT_HERO_DESCRIPTION,
      heroLoopWords: DEFAULT_HERO_LOOP_WORDS,
    });
    return this.settingsRepository.save(created);
  }

  async update(
    dto: UpdateSettingsDto,
    logoPath?: string,
    faviconPath?: string,
  ): Promise<Settings> {
    const settings = await this.get();

    if (dto.siteName !== undefined) settings.siteName = dto.siteName;
    if (dto.phone !== undefined) settings.phone = dto.phone;
    if (dto.email !== undefined) settings.email = dto.email;
    if (dto.whatsapp !== undefined) settings.whatsapp = dto.whatsapp;
    if (dto.facebookUrl !== undefined) settings.facebookUrl = dto.facebookUrl;
    if (dto.instagramUrl !== undefined) settings.instagramUrl = dto.instagramUrl;
    if (dto.tiktokUrl !== undefined) settings.tiktokUrl = dto.tiktokUrl;
    if (dto.metaPixelId !== undefined) settings.metaPixelId = dto.metaPixelId;
    if (dto.heroTitle !== undefined) settings.heroTitle = dto.heroTitle;
    if (dto.heroDescription !== undefined) settings.heroDescription = dto.heroDescription;
    if (dto.heroLoopWords !== undefined) settings.heroLoopWords = dto.heroLoopWords;

    if (logoPath) {
      this.removeImageFile(settings.logo);
      settings.logo = logoPath;
    }
    if (faviconPath) {
      this.removeImageFile(settings.favicon);
      settings.favicon = faviconPath;
    }

    return this.settingsRepository.save(settings);
  }

  private removeImageFile(imagePath?: string | null): void {
    if (!imagePath) return;
    const fullPath = path.join(process.cwd(), imagePath);
    fs.promises.unlink(fullPath).catch(() => undefined);
  }
}
