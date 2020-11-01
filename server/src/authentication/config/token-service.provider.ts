import { JwtToken } from '../adapters/jwt-token/jwt-token'

export const tokenServiceProvider = {
  provide: 'TOKEN_SERVICE',
  useClass: JwtToken,
}
