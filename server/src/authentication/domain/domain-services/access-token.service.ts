import { Injectable, Inject } from '@nestjs/common'
import { User } from '../model/user'
import { TokenService } from '../ports/token-service'

@Injectable()
export class AccessTokenService {
  constructor(@Inject('TOKEN_SERVICE') private tokenService: TokenService) {}

  async getUserAccessToken(user: User) {
    // TODO: check https://github.com/auth0/node-jsonwebtoken
    const payload = { email: user.email }
    const access_token = this.tokenService.sign(payload)
    return { access_token }
  }
}
