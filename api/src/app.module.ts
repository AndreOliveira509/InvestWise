import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';     // <-- Correção
import { UsersModule } from './users/users.module';   // <-- Correção
import { PrismaModule } from './prisma/prisma.module'; // <-- Correção

@Module({
  imports: [AuthModule, PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
