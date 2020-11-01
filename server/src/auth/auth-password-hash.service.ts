import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class PasswordHashService {
  private saltRounds = 10

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  public async compare(
    plainTextPassowrd: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassowrd, passwordHash)
  }
}
