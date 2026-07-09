import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Company } from '../companies/entities/company.entity';
import { Category } from '../categories/entities/category.entity';
import { Subcategory } from '../subcategories/entities/subcategory.entity';
import { MerchantRegion } from '../merchants/entities/merchant.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoriesRepository: Repository<Subcategory>,
  ) {}

  async create(dto: CreateProductDto, imagePath?: string): Promise<Product> {
    await this.assertCompanyExists(dto.companyId);
    await this.assertCategoryExists(dto.categoryId);
    if (dto.subcategoryId !== undefined) {
      await this.assertSubcategoryBelongsToCategory(dto.subcategoryId, dto.categoryId);
    }

    const product = this.productsRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      image: imagePath ?? null,
      sku: dto.sku,
      wholesalePriceWestBank: dto.wholesalePriceWestBank,
      wholesalePriceIsrael: dto.wholesalePriceIsrael,
      quantity: dto.quantity,
      hasWarranty: dto.hasWarranty ?? false,
      warrantyMonths: dto.hasWarranty ? 12 : null,
      companyId: dto.companyId,
      categoryId: dto.categoryId,
      subcategoryId: dto.subcategoryId ?? null,
    });

    const saved = await this.saveOrThrowOnDuplicateSku(product);
    return this.findOne(saved.id);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: { company: true, category: true, subcategory: true },
      order: { id: 'DESC' },
    });
  }

  async findAllPublic() {
    const products = await this.findAll();
    return products.map((product) => this.stripPrices(product));
  }

  async findAllForMerchant(region: MerchantRegion) {
    const products = await this.findAll();
    return products.map((product) => ({
      ...this.stripPrices(product),
      price:
        region === MerchantRegion.WEST_BANK
          ? product.wholesalePriceWestBank
          : product.wholesalePriceIsrael,
    }));
  }

  private stripPrices(product: Product) {
    const { wholesalePriceWestBank: _wb, wholesalePriceIsrael: _il, ...rest } = product;
    return rest;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { company: true, category: true, subcategory: true },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    imagePath?: string,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.companyId !== undefined) {
      await this.assertCompanyExists(dto.companyId);
      product.companyId = dto.companyId;
    }

    const effectiveCategoryId = dto.categoryId ?? product.categoryId;
    if (dto.categoryId !== undefined) {
      await this.assertCategoryExists(dto.categoryId);
      product.categoryId = dto.categoryId;
    }

    if (dto.subcategoryId !== undefined) {
      await this.assertSubcategoryBelongsToCategory(
        dto.subcategoryId,
        effectiveCategoryId,
      );
      product.subcategoryId = dto.subcategoryId;
    }

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.sku !== undefined) product.sku = dto.sku;
    if (dto.wholesalePriceWestBank !== undefined)
      product.wholesalePriceWestBank = dto.wholesalePriceWestBank;
    if (dto.wholesalePriceIsrael !== undefined)
      product.wholesalePriceIsrael = dto.wholesalePriceIsrael;
    if (dto.quantity !== undefined) product.quantity = dto.quantity;
    if (dto.hasWarranty !== undefined) {
      product.hasWarranty = dto.hasWarranty;
      product.warrantyMonths = dto.hasWarranty ? 12 : null;
    }
    if (imagePath) {
      this.removeImageFile(product.image);
      product.image = imagePath;
    }

    await this.saveOrThrowOnDuplicateSku(product);
    return this.findOne(id);
  }

  private async saveOrThrowOnDuplicateSku(product: Product): Promise<Product> {
    try {
      return await this.productsRepository.save(product);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('كود المنتج (SKU) مستخدم مسبقاً لمنتج آخر');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    this.removeImageFile(product.image);
    await this.productsRepository.remove(product);
  }

  private async assertCompanyExists(companyId: number): Promise<void> {
    const exists = await this.companiesRepository.exists({
      where: { id: companyId },
    });
    if (!exists) {
      throw new NotFoundException(`Company #${companyId} not found`);
    }
  }

  private async assertCategoryExists(categoryId: number): Promise<void> {
    const exists = await this.categoriesRepository.exists({
      where: { id: categoryId },
    });
    if (!exists) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }
  }

  private async assertSubcategoryBelongsToCategory(
    subcategoryId: number | undefined,
    categoryId: number,
  ): Promise<void> {
    if (subcategoryId === undefined) return;

    const subcategory = await this.subcategoriesRepository.findOne({
      where: { id: subcategoryId },
    });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory #${subcategoryId} not found`);
    }
    if (subcategory.categoryId !== categoryId) {
      throw new BadRequestException(
        'الصنف الفرعي المختار لا ينتمي للصنف الرئيسي المختار',
      );
    }
  }

  private removeImageFile(imagePath?: string | null): void {
    if (!imagePath) return;
    const fullPath = path.join(process.cwd(), imagePath);
    fs.promises.unlink(fullPath).catch(() => undefined);
  }
}
