import { Injectable, ForbiddenException } from '@nestjs/common'
import { UsersRepositoryService } from '../users/users-repository.service'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'
import { User } from '../users/model/user'
import { PasswordHashService } from './auth-password-hash.service'

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepositoryService,
    private jwtService: JwtService,
    private passwordHashService: PasswordHashService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user?.password) return null
    if (user && this.passwordHashService.compare(pass, user.password)) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: User) {
    // TODO: check https://github.com/auth0/node-jsonwebtoken
    const payload = { email: user.email }
    const access_token = this.jwtService.sign(payload)
    return { access_token }
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto
    const existingUser = await this.usersRepository.findByEmail(email)
    const passwordHash = await this.passwordHashService.hash(password)
    if (existingUser) {
      throw new ForbiddenException(
        'An account is already registered with this email',
      )
    }
    return await this.usersRepository.create({ email, password: passwordHash })
  }
}
