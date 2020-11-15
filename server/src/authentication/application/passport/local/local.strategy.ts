import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthenticationUseCase } from '../../../domain/use-cases/authentication.usecase'
import { fold } from 'fp-ts/lib/Option'
import { User } from '../../../domain/model/user'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authUseCase: AuthenticationUseCase) {
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
    const user = await this.authUseCase.getUserByCredentials(email, password)
    return this.validateUserOption(user)
  }
}
