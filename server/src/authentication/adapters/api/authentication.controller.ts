import { Body, Controller, Post, Request, UseGuards, Get } from '@nestjs/common'
import { LocalAuthGuard } from '../passport/local/local-auth.guard'
import { JwtAuthGuard } from '../passport/jwt/jwt-auth.guard'
import { RegistrationService } from '../../domain/domain-services/registration.service'
import { CreateUserDto } from '../../domain/ports/create-user.dto'
import { AccessTokenService } from '../../domain/domain-services/access-token.service'

@Controller('auth')
export class AuthenticationController {
  constructor(
    private registrationService: RegistrationService,
    private accessTokenService: AccessTokenService,
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.registrationService.registerUser(createUserDto)
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req: any) {
    return this.accessTokenService.getUserAccessToken(req.user)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return req.user
  }
}
