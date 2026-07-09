import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Subcategory } from './entities/subcategory.entity';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoriesRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(
    dto: CreateSubcategoryDto,
    imagePath?: string,
  ): Promise<Subcategory> {
    const category = await this.categoriesRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category #${dto.categoryId} not found`);
    }

    const subcategory = this.subcategoriesRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      image: imagePath ?? null,
      categoryId: dto.categoryId,
    });

    return this.subcategoriesRepository.save(subcategory);
  }

  async findOne(id: number): Promise<Subcategory> {
    const subcategory = await this.subcategoriesRepository.findOne({
      where: { id },
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory #${id} not found`);
    }

    return subcategory;
  }

  async update(
    id: number,
    dto: UpdateSubcategoryDto,
    imagePath?: string,
  ): Promise<Subcategory> {
    const subcategory = await this.findOne(id);

    if (dto.name !== undefined) subcategory.name = dto.name;
    if (dto.description !== undefined)
      subcategory.description = dto.description;
    if (imagePath) {
      this.removeImageFile(subcategory.image);
      subcategory.image = imagePath;
    }

    return this.subcategoriesRepository.save(subcategory);
  }

  async remove(id: number): Promise<void> {
    const subcategory = await this.findOne(id);
    this.removeImageFile(subcategory.image);
    await this.subcategoriesRepository.remove(subcategory);
  }

  private removeImageFile(imagePath?: string | null): void {
    if (!imagePath) return;
    const fullPath = path.join(process.cwd(), imagePath);
    fs.promises.unlink(fullPath).catch(() => undefined);
  }
}
