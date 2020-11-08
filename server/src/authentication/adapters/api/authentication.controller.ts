import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  ForbiddenException,
} from '@nestjs/common'
import { LocalAuthGuard } from '../passport/local/local-auth.guard'
import { JwtAuthGuard } from '../passport/jwt/jwt-auth.guard'
import { RegistrationService } from '../../domain/services/registration.service'
import { CreateUserDto } from '../../domain/ports/create-user.dto'
import { JwtAccessTokenService } from '../passport/jwt/jwt-access-token.service'
import { JwtReqUser } from '../passport/jwt/jwt-req-user'
import { isNone } from 'fp-ts/lib/Option'

@Controller('auth')
export class AuthenticationController {
  constructor(
    private registrationService: RegistrationService,
    private jwtAccessTokenService: JwtAccessTokenService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.registrationService.registerUser(createUserDto)
    if (isNone(result)) {
      const message = 'An account is already registered with this email'
      throw new ForbiddenException(message)
    }
    return result.value
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req: any) {
    return this.jwtAccessTokenService.getUserAccessToken(req.user)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any): JwtReqUser {
    return req.user
  }
}
