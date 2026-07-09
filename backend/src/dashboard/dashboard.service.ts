import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

export interface DashboardStats {
  totalSales: number;
  ordersCount: number;
  pendingOrdersCount: number;
  productsCount: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const [sumResult, ordersCount, pendingOrdersCount, productsCount] = await Promise.all([
      this.ordersRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'sum')
        .where('order.status = :status', { status: OrderStatus.COMPLETED })
        .getRawOne<{ sum: string | null }>(),
      this.ordersRepository.count(),
      this.ordersRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.productsRepository.count(),
    ]);

    return {
      totalSales: sumResult?.sum ? parseFloat(sumResult.sum) : 0,
      ordersCount,
      pendingOrdersCount,
      productsCount,
    };
  }
}
