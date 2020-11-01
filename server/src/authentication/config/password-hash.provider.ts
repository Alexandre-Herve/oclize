import { BcryptPasswordHash } from '../adapters/bcrypt-password-hash/bcrypt-password-hash'

export const passwordHashProvider = {
  provide: 'PASSWORD_HASH',
  useClass: BcryptPasswordHash,
}
