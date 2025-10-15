import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
