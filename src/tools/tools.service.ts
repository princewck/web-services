import { HttpException, Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tools } from '../models';
import { Repository } from 'typeorm';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { PaginateList } from '../utils/PaginateList';

@Injectable()
export class ToolsService {

  constructor(@InjectRepository(Tools)
  private readonly toolRepository: Repository<Tools>) { }

  create(createToolDto: CreateToolDto) {
    return this.toolRepository.save(createToolDto);
  }

  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE, filter) {
    const [templates, total] = await this.toolRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {...filter },
    });
    return new PaginateList({ data: templates, total, pageSize, page });
  }

  async findOne(id: number) {
    return await this.toolRepository.findOne({ id });
  }

  async findByKey(id: string) {
    return await this.toolRepository.findOne({ key: id });
  }

  update(id: number, updateToolDto: UpdateToolDto) {
    return this.toolRepository.update({ id }, updateToolDto);
  }

  remove(id: number) {
    return this.toolRepository.delete(id);
  }
}
