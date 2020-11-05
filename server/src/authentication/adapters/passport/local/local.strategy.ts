import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthenticationService } from '../../../domain/domain-services/authentication.service'
import { fold } from 'fp-ts/lib/Option'
import { User } from '../../../domain/model/user'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({
      usernameField: 'email',
    })
  }

  private onNoUser = () => {
    throw new UnauthorizedException()
  }

  private onSomeUser = (user: User) => ({
    email: user.props.email,
    id: user.id,
  })

  private validateUserOption = fold(this.onNoUser, this.onSomeUser)

  async validate(email: string, password: string): Promise<{ email: string }> {
    const user = await this.authService.getUserByCredentials(email, password)
    return this.validateUserOption(user)
  }
}
