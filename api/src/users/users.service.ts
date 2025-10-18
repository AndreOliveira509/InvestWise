import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {} // Injete o PrismaService

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
    const userTransactions = await this.prisma.transaction.findMany({
      where: { userId: userId },
      orderBy: { date: 'desc' }, // Ordena da mais recente para a mais antiga
    });

    const userInvestments = await this.prisma.investment.findMany({
      where: { userId: userId },
    });

    // LÓGICA CORRIGIDA E MAIS FLEXÍVEL
    const monthlyIncome = userTransactions
      .filter(t => t.type.toUpperCase() === 'INCOME') // Compara em maiúsculo
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const monthlyExpenses = userTransactions
      .filter(t => t.type.toUpperCase() === 'EXPENSE') // Compara em maiúsculo
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalInvestments = userInvestments.reduce(
      (sum, i) => sum + parseFloat(i.value.toString()), 0
    );
    
    // NOVO: Prepara a lista das últimas 10 transações para a IA
    const recentTransactions = userTransactions.slice(0, 10).map(t => ({
      description: t.description,
      amount: parseFloat(t.amount.toString()),
      date: t.date.toISOString().split('T')[0],
      type: t.type
    }));

    return {
      monthlyIncome,
      monthlyExpenses,
      savings: totalInvestments,
      debts: 0,
      financialGoals: 'Não definida',
      recentTransactions, // ADICIONA A LISTA DE TRANSAÇÕES NA RESPOSTA
    };
  }
}