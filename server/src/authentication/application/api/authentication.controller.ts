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
import { RegistrationUseCase } from '../../domain/use-cases/registration.usecase'
import { CreateUserDto } from '../../domain/ports/create-user.dto'
import { JwtAccessTokenService } from '../passport/jwt/jwt-access-token.service'
import { JwtReqUser } from '../passport/jwt/jwt-req-user'
import { isNone } from 'fp-ts/lib/Option'
import { UniqueTokenAuthGuard } from '../passport/unique-token/unique-token-auth.guard'
import { RequestUniqueTokenUseCase } from '../../domain/use-cases/request-unique-token.usecase'
import { RequestUniqueTokenDto } from './dtos/request-unique-token.dto'

@Controller('auth')
export class AuthenticationController {
  constructor(
    private registrationUseCase: RegistrationUseCase,
    private jwtAccessTokenService: JwtAccessTokenService,
    private requestUniqueTokenUseCase: RequestUniqueTokenUseCase,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.registrationUseCase.registerUser(createUserDto)
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

  @Post('request-unique-token')
  requestUniqueToken(@Body() { email }: RequestUniqueTokenDto) {
    this.requestUniqueTokenUseCase.requestUniqueToken(email)
    return
  }

  @Post('claim-unique-token')
  @UseGuards(UniqueTokenAuthGuard)
  tokenlogin(@Request() req: any) {
    return this.jwtAccessTokenService.getUserAccessToken(req.user)
  }
}
