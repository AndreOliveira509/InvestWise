import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('jwt'))
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    const userId = req.user.id;
    return this.transactionService.create(createTransactionDto, userId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    return this.transactionService.findAllByUserId(userId);
  }
}
