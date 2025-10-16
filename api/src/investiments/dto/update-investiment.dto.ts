import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestimentDto } from './create-investiment.dto';

export class UpdateInvestimentDto extends PartialType(CreateInvestimentDto) {}
