import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './adapters/passport/jwt/jwt.strategy'
import { LocalStrategy } from './adapters/passport/local/local.strategy'
import { JwtConfigService } from './adapters/passport/jwt/jwt-config.service'
import { MongoDbModule } from '../infrastructure/mongodb/mobgodb.module'
import { passwordHashProvider } from './config/password-hash.provider'
import { tokenServiceProvider } from './config/token-service.provider'
import { usersRepositoryProvider } from './config/user-repository.provider'
import { AccessTokenService } from './domain/domain-services/access-token.service'
import { AuthenticationService } from './domain/domain-services/authentication.service'
import { RegistrationService } from './domain/domain-services/registration.service'
import { AuthenticationController } from './adapters/api/authentication.controller'

@Module({
  controllers: [AuthenticationController],
  imports: [
    MongoDbModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  providers: [
    AccessTokenService,
    AuthenticationService,
    JwtStrategy,
    LocalStrategy,
    RegistrationService,
    passwordHashProvider,
    tokenServiceProvider,
    usersRepositoryProvider,
  ],
})
export class AuthenticationModule {}
