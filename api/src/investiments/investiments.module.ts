import { Module } from '@nestjs/common';
import { InvestimentsService } from './investiments.service';
import { InvestimentsController } from './investiments.controller';

@Module({
  controllers: [InvestimentsController],
  providers: [InvestimentsService],
})
export class InvestimentsModule {}
