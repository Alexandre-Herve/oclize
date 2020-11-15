import { Injectable, Inject } from '@nestjs/common'
import { UserRepository } from '../ports/user-repository'
import { PasswordHash } from '../ports/password-hash'
import { User } from '../model/user'
import { Option, isNone, none, some } from 'fp-ts/lib/Option'
import { PASSWORD_HASH, USER_REPOSITORY } from '../ports/constants'

@Injectable()
export class AuthenticationUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private usersRepository: UserRepository,
    @Inject(PASSWORD_HASH) private passwordHashService: PasswordHash,
  ) {}

  async getUserByCredentials(
    email: string,
    pass: string,
  ): Promise<Option<User>> {
    const userOption = await this.usersRepository.getByEmail(email)
    if (isNone(userOption)) {
      return none
    }
    const user = userOption.value
    const password = user.props.password
    if (!password) {
      return none
    }
    const valid = await this.passwordHashService.compare(pass, password)
    if (!valid) {
      return none
    }
    return some(user)
  }
}
