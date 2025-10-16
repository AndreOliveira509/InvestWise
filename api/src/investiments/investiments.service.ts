import { Injectable } from '@nestjs/common';
import { CreateInvestimentDto } from './dto/create-investiment.dto';
import { UpdateInvestimentDto } from './dto/update-investiment.dto';

@Injectable()
export class InvestimentsService {
  create(createInvestimentDto: CreateInvestimentDto) {
    return 'This action adds a new investiment';
  }

  findAll() {
    return `This action returns all investiments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} investiment`;
  }

  update(id: number, updateInvestimentDto: UpdateInvestimentDto) {
    return `This action updates a #${id} investiment`;
  }

  remove(id: number) {
    return `This action removes a #${id} investiment`;
  }
}
