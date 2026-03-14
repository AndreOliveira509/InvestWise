import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    amount: number;

    @IsDateString()
    date: string;

    @IsString()
    type: 'EXPENSE' | 'INCOME';

    @IsNumber()
    categoryId: number;
}
