import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsNumber()
    @IsOptional()
    patrimonio?: number;

    @IsString()
    @IsOptional()
    name?: string;
}
