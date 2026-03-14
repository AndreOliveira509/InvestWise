import {
   Injectable,
   ConflictException,
   UnauthorizedException } from '@nestjs/common';
import { JwtService} from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ){}

  // Cadastro
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

  // Login
  async login(loginDto: LoginDto){
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user){
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid){
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
}
