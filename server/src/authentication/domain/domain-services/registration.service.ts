import { Injectable, Inject, ForbiddenException } from '@nestjs/common'
import { UserRepository } from '../ports/user-repository'
import { PasswordHash } from '../ports/password-hash'
import { CreateUserDto } from '../ports/create-user.dto'

@Injectable()
export class RegistrationService {
  constructor(
    @Inject('USER_REPOSITORY') private usersRepository: UserRepository,
    @Inject('PASSWORD_HASH') private passwordHashService: PasswordHash,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto
    const existingUser = await this.usersRepository.getByEmail(email)
    if (existingUser) {
      // TODO: remove dependency to exception
      throw new ForbiddenException(
        'An account is already registered with this email',
      )
    }
    const passwordHash = password
      ? await this.passwordHashService.hash(password)
      : undefined

    return await this.usersRepository.create({
      email,
      password: passwordHash,
    })
  }
}
