import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = {
      ...updateUserDto,
      name: updateUserDto.name !== undefined ? String(updateUserDto.name) : undefined,
    } as any;

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }


  async getFinancialSummary(userId: number) {
    
    // 1. BUSCAR O USUÁRIO
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        renda_mensal: true,
      }
    });

    // Esta verificação é importante
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    // 2. BUSCAR AS OUTRAS INFORMAÇÕES
    const userTransactions = await this.prisma.transaction.findMany({
      where: { userId: userId },
      orderBy: { date: 'desc' }, 
    });

    const userInvestments = await this.prisma.investment.findMany({
      where: { userId: userId },
    });

    // 3. FAZER OS CÁLCULOS
    const profileMonthlyIncome = parseFloat(user?.renda_mensal?.toString() || '0');
    const monthlyExpenses = userTransactions
      .filter(t => t.type.toUpperCase() === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalInvestments = userInvestments.reduce(
      (sum, i) => sum + parseFloat(i.value.toString()), 0
    );
    
    const recentTransactions = userTransactions.slice(0, 10).map(t => ({
      description: t.description,
      amount: parseFloat(t.amount.toString()),
      date: t.date.toISOString().split('T')[0],
      type: t.type
    }));

    // 4. RETORNAR OS DADOS
    return {
      monthlyIncome: profileMonthlyIncome, // Agora seguro
      monthlyExpenses,
      savings: totalInvestments,
      debts: 0,
      financialGoals: 'Não definida',
      recentTransactions, 
    };
  }
}