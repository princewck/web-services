import { HttpException, Injectable } from '@nestjs/common';
import { CreateGptTemplateDto } from './dto/create-gpt-template.dto';
import { UpdateGptTemplateDto } from './dto/update-gpt-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { GptTemplates } from '../models';
import { PaginateList } from '../utils/PaginateList';

@Injectable()
export class GptTemplateService {

  constructor(
    @InjectRepository(GptTemplates)
    private gptTemplateRepository: Repository<GptTemplates>
  ) {}

  create(createGptTemplateDto: CreateGptTemplateDto) {
    return this.gptTemplateRepository.save(createGptTemplateDto);
  }

  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE, filter = {}) {
    const [templates, total] = await this.gptTemplateRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {},
    });
    return new PaginateList({ data: templates, total, pageSize, page });
  }

  async findOne(id: number) {
    const res = await this.gptTemplateRepository.findOne({ id });
    try {
      res.prompt = JSON.parse(res.prompt);
    } catch {
      throw new HttpException('prompt error', 400);
    }
    return res;
  }

  update(id: number, updateGptTemplateDto: UpdateGptTemplateDto) {
    return this.gptTemplateRepository.update({ id }, updateGptTemplateDto);
  }

  remove(id: number) {
    return this.gptTemplateRepository.delete(id);
  }
}
