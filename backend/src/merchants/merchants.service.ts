import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Merchant } from './entities/merchant.entity';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantsRepository: Repository<Merchant>,
  ) {}

  async create(dto: CreateMerchantDto): Promise<Merchant> {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const merchant = this.merchantsRepository.create({
      name: dto.name,
      address: dto.address,
      phone: dto.phone,
      region: dto.region,
      password: hashedPassword,
      isActive: true,
    });

    const saved = await this.merchantsRepository.save(merchant);
    return this.findOne(saved.id);
  }

  findAll(): Promise<Merchant[]> {
    return this.merchantsRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Merchant> {
    const merchant = await this.merchantsRepository.findOne({ where: { id } });

    if (!merchant) {
      throw new NotFoundException(`Merchant #${id} not found`);
    }

    return merchant;
  }

  async update(id: number, dto: UpdateMerchantDto): Promise<Merchant> {
    await this.findOne(id);

    const data: Partial<Merchant> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.region !== undefined) data.region = dto.region;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    await this.merchantsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const merchant = await this.findOne(id);
    await this.merchantsRepository.remove(merchant);
  }

  findByPhoneWithPassword(phone: string): Promise<Merchant | null> {
    return this.merchantsRepository.findOne({
      where: { phone },
      select: {
        id: true,
        name: true,
        phone: true,
        region: true,
        password: true,
        isActive: true,
      },
    });
  }
}
