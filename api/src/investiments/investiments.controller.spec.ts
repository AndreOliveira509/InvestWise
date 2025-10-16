import { Test, TestingModule } from '@nestjs/testing';
import { InvestimentsController } from './investiments.controller';
import { InvestimentsService } from './investiments.service';

describe('InvestimentsController', () => {
  let controller: InvestimentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestimentsController],
      providers: [InvestimentsService],
    }).compile();

    controller = module.get<InvestimentsController>(InvestimentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
