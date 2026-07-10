import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnersRepository: Repository<Partner>,
  ) {}

  create(dto: CreatePartnerDto, imagePath?: string): Promise<Partner> {
    const partner = this.partnersRepository.create({
      name: dto.name,
      note: dto.note ?? null,
      image: imagePath ?? null,
    });

    return this.partnersRepository.save(partner);
  }

  findAll(): Promise<Partner[]> {
    return this.partnersRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Partner> {
    const partner = await this.partnersRepository.findOne({ where: { id } });

    if (!partner) {
      throw new NotFoundException(`Partner #${id} not found`);
    }

    return partner;
  }

  async update(
    id: number,
    dto: UpdatePartnerDto,
    imagePath?: string,
  ): Promise<Partner> {
    const partner = await this.findOne(id);

    if (dto.name !== undefined) partner.name = dto.name;
    if (dto.note !== undefined) partner.note = dto.note;
    if (imagePath) {
      this.removeImageFile(partner.image);
      partner.image = imagePath;
    }

    return this.partnersRepository.save(partner);
  }

  async remove(id: number): Promise<void> {
    const partner = await this.findOne(id);

    this.removeImageFile(partner.image);
    await this.partnersRepository.remove(partner);
  }

  private removeImageFile(imagePath?: string | null): void {
    if (!imagePath) return;
    const fullPath = path.join(process.cwd(), imagePath);
    fs.promises.unlink(fullPath).catch(() => undefined);
  }
}
