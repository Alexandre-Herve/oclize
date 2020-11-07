import { PasswordHash } from '../../domain/ports/password-hash'
import * as bcrypt from 'bcryptjs'

export class BcryptPasswordHash implements PasswordHash {
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
