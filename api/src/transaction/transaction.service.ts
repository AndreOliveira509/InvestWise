import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto, userId: number){
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        userId: userId,
      },
    });
  }

  findAllByUserId(userId: number){
    return this.prisma.transaction.findMany({
      where: { userId},
      orderBy: {
        date: 'desc',
      },
      include: {
        category: true,
      },
    });
  }
}
