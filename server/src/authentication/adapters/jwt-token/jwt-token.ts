import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtToken {
  constructor(private jwtService: JwtService) {}
  public sign = (payload: any) => {
    return this.jwtService.sign(payload)
  }
}
