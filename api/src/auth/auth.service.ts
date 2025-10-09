import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto){
    const { email, name, password} = createUserDto;

    // Verificação de duplicidade do e-mail
    const userExists = await this.prisma.user.findUnique({
      where: {email},
    });

    if (userExists){
      throw new ConflictException('Este email já está cadastrado');
    }

    // Gera hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva no banco de dados
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Retorna o usuário criado
    const { password: _, ...result } = user;
    return result;
  }
}
