import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtReqUser } from './jwt-req-user'
import { JwtTokenPayload } from './jwt-token-payload'

@Injectable()
export class JwtAccessTokenService {
  constructor(private jwtService: JwtService) {}

  async getUserAccessToken(user: JwtReqUser) {
    const payload: JwtTokenPayload = { email: user.email, id: user.id }
    const access_token = this.jwtService.sign(payload)
    return { access_token }
  }
}
