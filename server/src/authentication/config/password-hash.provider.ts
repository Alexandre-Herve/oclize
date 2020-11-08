import { BcryptPasswordHash } from '../adapters/bcrypt-password-hash/bcrypt-password-hash'
import { PASSWORD_HASH } from '../domain/ports/constants'

export const passwordHashProvider = {
  provide: PASSWORD_HASH,
  useClass: BcryptPasswordHash,
}
