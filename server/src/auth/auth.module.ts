import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local/local.strategy'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt/jwt.strategy'
import { AuthController } from './auth.controller'
import { JwtConfigService } from './strategies/jwt/jwt-config.service'
import { PasswordHashService } from './auth-password-hash.service'

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, PasswordHashService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
