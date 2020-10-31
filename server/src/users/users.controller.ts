import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
