import { Injectable, NotFoundException } from '@nestjs/common'; 
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}


  async create(createInvestmentDto: CreateInvestmentDto, userId: number) {
    const { category: categoryName, ...investmentData } = createInvestmentDto;

    const category = await this.prisma.categoryInvestment.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      throw new NotFoundException(`A categoria de investimento '${categoryName}' não foi encontrada.`);
    }


    return this.prisma.investment.create({
      data: {
        ...investmentData,
        userId: userId,
        categoryId: category.id, 
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.investment.findMany({
      where: { userId },
      orderBy: {
        date: 'desc',
      },
    });
  }

  remove(id: number) {
    return this.prisma.investment.delete({
      where: { id },
    });
  }
}