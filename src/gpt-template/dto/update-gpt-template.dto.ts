import { PartialType } from '@nestjs/mapped-types';
import { CreateGptTemplateDto } from './create-gpt-template.dto';

export class UpdateGptTemplateDto extends PartialType(CreateGptTemplateDto) {}
