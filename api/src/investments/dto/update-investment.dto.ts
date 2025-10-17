import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentDto } from './create-investment.dto';

export class UpdateInvestimentDto extends PartialType(CreateInvestmentDto) {}
