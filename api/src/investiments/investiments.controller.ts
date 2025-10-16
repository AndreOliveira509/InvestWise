import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvestimentsService } from './investiments.service';
import { CreateInvestimentDto } from './dto/create-investiment.dto';
import { UpdateInvestimentDto } from './dto/update-investiment.dto';

@Controller('investiments')
export class InvestimentsController {
  constructor(private readonly investimentsService: InvestimentsService) {}

  
}
