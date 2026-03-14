import { Controller, Get, UseGuards, Req, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport'
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req) {
    // req.user é populado pela JwtStrategy
    const { password, ...user} = req.user;
    return user;
  }

  @UseGuards(AuthGuard('jwt')) // Protege a rota, garantindo que o usuário esteja logado
  @Get('financial-summary')
  getFinancialSummary(@Req() req) {
    // req.user.id virá do payload do token JWT após a validação
    const userId = req.user.id;
    return this.usersService.getFinancialSummary(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.usersService.update(userId, updateUserDto);
  }
}
