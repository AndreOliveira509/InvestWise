import { Test, TestingModule } from '@nestjs/testing';
import { InvestimentsService } from './investiments.service';

describe('InvestimentsService', () => {
  let service: InvestimentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestimentsService],
    }).compile();

    service = module.get<InvestimentsService>(InvestimentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
