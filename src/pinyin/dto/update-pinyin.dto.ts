import { PartialType } from '@nestjs/mapped-types';
import { CreatePinyinDto } from './create-pinyin.dto';

export class UpdatePinyinDto extends PartialType(CreatePinyinDto) {}
