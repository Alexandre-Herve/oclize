import { Injectable, Inject } from '@nestjs/common'
import { UserRepository } from '../ports/user-repository'
import { PasswordHash } from '../ports/password-hash'
import { User } from '../model/user'

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('USER_REPOSITORY') private usersRepository: UserRepository,
    @Inject('PASSWORD_HASH') private passwordHashService: PasswordHash,
  ) {}

  async getUserByCredentials(
    email: string,
    pass: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.getByEmail(email)
    if (!user?.password) return null
    if (user && this.passwordHashService.compare(pass, user.password)) {
      const { password, ...result } = user
      return result
    }
    return null
  }
}
