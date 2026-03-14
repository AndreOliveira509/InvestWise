import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsNumber()
    @IsOptional()
    renda_mensal?: number;

    @IsString()
    @IsOptional()
    name?: string;
}
