import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  create(dto: CreateCompanyDto, imagePath?: string): Promise<Company> {
    const company = this.companiesRepository.create({
      name: dto.name,
      note: dto.note ?? null,
      image: imagePath ?? null,
    });

    return this.companiesRepository.save(company);
  }

  findAll(): Promise<Company[]> {
    return this.companiesRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return company;
  }

  async update(
    id: number,
    dto: UpdateCompanyDto,
    imagePath?: string,
  ): Promise<Company> {
    const company = await this.findOne(id);

    if (dto.name !== undefined) company.name = dto.name;
    if (dto.note !== undefined) company.note = dto.note;
    if (imagePath) {
      this.removeImageFile(company.image);
      company.image = imagePath;
    }

    return this.companiesRepository.save(company);
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);

    const productsCount = await this.productsRepository.count({
      where: { companyId: id },
    });
    if (productsCount > 0) {
      throw new ConflictException(
        'لا يمكن حذف شركة مرتبطة بمنتجات، احذف أو عدّل هذه المنتجات أولاً',
      );
    }

    this.removeImageFile(company.image);
    await this.companiesRepository.remove(company);
  }

  private removeImageFile(imagePath?: string | null): void {
    if (!imagePath) return;
    const fullPath = path.join(process.cwd(), imagePath);
    fs.promises.unlink(fullPath).catch(() => undefined);
  }
}
