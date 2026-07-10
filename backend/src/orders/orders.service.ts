import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Product } from '../products/entities/product.entity';
import { MerchantRegion } from '../merchants/entities/merchant.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(
    merchantId: number,
    region: MerchantRegion,
    dto: CreateOrderDto,
  ): Promise<Order> {
    const items: OrderItem[] = [];
    let total = 0;

    for (const line of dto.items) {
      const product = await this.productsRepository.findOne({
        where: { id: line.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product #${line.productId} not found`);
      }

      const unitPrice =
        region === MerchantRegion.WEST_BANK
          ? product.wholesalePriceWestBank
          : product.wholesalePriceIsrael;
      const subtotal = unitPrice * line.quantity;
      total += subtotal;

      const item = new OrderItem();
      item.productId = product.id;
      item.productName = product.name;
      item.unitPrice = unitPrice;
      item.quantity = line.quantity;
      item.subtotal = subtotal;
      item.hasWarranty = product.hasWarranty;
      item.warrantyMonths = product.warrantyMonths;
      items.push(item);
    }

    const order = this.ordersRepository.create({
      merchantId,
      status: OrderStatus.PENDING,
      total,
      items,
    });

    const saved = await this.ordersRepository.save(order);
    return this.findOne(saved.id);
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: { merchant: true, items: { product: true } },
      order: { id: 'DESC' },
    });
  }

  async findByMerchant(merchantId: number): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      where: { merchantId },
      relations: { items: { product: true } },
      order: { id: 'DESC' },
    });

    // Strip the other region's wholesale price and stock level; the merchant
    // only needs the product's image alongside the already-snapshotted item data.
    for (const order of orders) {
      for (const item of order.items) {
        if (item.product) {
          item.product = {
            id: item.product.id,
            image: item.product.image,
          } as Product;
        }
      }
    }

    return orders;
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { merchant: true, items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order> {
    await this.findOne(id);
    await this.ordersRepository.update(id, { status: dto.status });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }
}
