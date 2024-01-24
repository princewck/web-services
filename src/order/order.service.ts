import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from '../models/entities/Orders';
import { Repository } from 'typeorm';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { PaginateList } from '../utils/PaginateList';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {

  }

  async create(createOrderDto: CreateOrderDto) {
    return await this.ordersRepository.save(createOrderDto);
  }

  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE, filter) {
    const [templates, total] = await this.ordersRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: { ...filter },
    });
    return new PaginateList({ data: templates, total, pageSize, page });
  }

  async findOne(id: number) {
    return await this.ordersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.ordersRepository.update(id, updateOrderDto);
  }

  async updateByNO(outTradeNo: string, updateOrderDto: UpdateOrderDto) {
    return await this.ordersRepository.update({ outTradeNo }, updateOrderDto);
  }

  remove(id: number) {
    return `removes a #${id} order not realized`;
  }
}
