import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto, imagePath?: string): Promise<Category> {
    const category = this.categoriesRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      image: imagePath ?? null,
    });

    return this.categoriesRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: { subcategories: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: { subcategories: true },
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return category;
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
    imagePath?: string,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.name !== undefined) category.name = dto.name;
    if (dto.description !== undefined) category.description = dto.description;
    if (imagePath) {
      this.removeImageFile(category.image);
      category.image = imagePath;
    }

    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    if (category.subcategories.length > 0) {
      throw new ConflictException(
        'لا يمكن حذف صنف يحتوي على أصناف فرعية، احذف الأصناف الفرعية أولاً',
      );
    }

    this.removeImageFile(category.image);
    await this.categoriesRepository.remove(category);
  }

  private removeImageFile(imagePath?: string | null): void {
    if (!imagePath) return;
    const fullPath = path.join(process.cwd(), imagePath);
    fs.promises.unlink(fullPath).catch(() => undefined);
  }
}
