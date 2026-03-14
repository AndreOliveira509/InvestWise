import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  create(@Body() createInvestmentDto: CreateInvestmentDto, @Req() req) {
    const userId = req.user.id;
    return this.investmentsService.create(createInvestmentDto, userId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    return this.investmentsService.findAll(userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe ) id: number) {
    return this.investmentsService.remove(id);
  }
  
}
