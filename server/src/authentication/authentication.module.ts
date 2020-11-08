import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './application/passport/jwt/jwt.strategy'
import { LocalStrategy } from './application/passport/local/local.strategy'
import { JwtConfigService } from './application/passport/jwt/jwt-config.service'
import { MongoDbModule } from '../infrastructure/mongodb/mobgodb.module'
import { passwordHashProvider } from './config/password-hash.provider'
import { usersRepositoryProvider } from './config/user-repository.provider'
import { AuthenticationService } from './domain/services/authentication.service'
import { RegistrationService } from './domain/services/registration.service'
import { JwtAccessTokenService } from './application/passport/jwt/jwt-access-token.service'
import { AuthenticationController } from './application/api/authentication.controller'

@Module({
  controllers: [AuthenticationController],
  imports: [
    MongoDbModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  providers: [
    JwtAccessTokenService,
    AuthenticationService,
    JwtStrategy,
    LocalStrategy,
    RegistrationService,
    passwordHashProvider,
    usersRepositoryProvider,
  ],
})
export class AuthenticationModule {}
