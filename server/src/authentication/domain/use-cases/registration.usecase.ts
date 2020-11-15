import { Injectable, Inject } from '@nestjs/common'
import { UserRepository } from '../ports/user-repository'
import { PasswordHash } from '../ports/password-hash'
import { CreateUserDto } from '../ports/create-user.dto'
import { Option, isSome, none, some } from 'fp-ts/lib/Option'
import { PASSWORD_HASH, USER_REPOSITORY } from '../ports/constants'

@Injectable()
export class RegistrationUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private usersRepository: UserRepository,
    @Inject(PASSWORD_HASH) private passwordHashService: PasswordHash,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<Option<string>> {
    const { email, password } = createUserDto
    const existingUser = await this.usersRepository.getByEmail(email)
    if (isSome(existingUser)) {
      return none
    }
    const passwordHash = password
      ? await this.passwordHashService.hash(password)
      : undefined
    const res = await this.usersRepository.create({
      email,
      password: passwordHash,
    })
    return some(res)
  }
}
