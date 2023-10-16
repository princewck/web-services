import { PartialType } from '@nestjs/mapped-types';
import { CreateSmsHistoryDto } from './create-sms-history.dto';

export class UpdateSmsHistoryDto extends PartialType(CreateSmsHistoryDto) {}
