import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateInvestmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

}