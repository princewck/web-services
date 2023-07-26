import { Injectable } from '@nestjs/common';
import { CreateToolCategoryDto } from './dto/create-tool-category.dto';
import { UpdateToolCategoryDto } from './dto/update-tool-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ToolCategories } from '../models';
import { Repository } from 'typeorm';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { PaginateList } from '../utils/PaginateList';

@Injectable()
export class ToolCategoryService {

  @InjectRepository(ToolCategories)
  private readonly categoryRepository: Repository<ToolCategories>

  create(CreateToolCategoryDto: CreateToolCategoryDto) {
    return this.categoryRepository.save(CreateToolCategoryDto);
  }

  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE, filter = {}) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {},
    });
    return new PaginateList({ data: categories, total, pageSize, page });
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({ id });
  }

  update(id: number, updateToolCategoryDto: UpdateToolCategoryDto) {
    return this.categoryRepository.update({ id }, updateToolCategoryDto);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
