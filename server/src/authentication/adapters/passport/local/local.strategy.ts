import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthenticationService } from '../../../domain/domain-services/authentication.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({
      usernameField: 'email',
    })
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.getUserByCredentials(email, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
