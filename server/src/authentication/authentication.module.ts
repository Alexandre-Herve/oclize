import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './application/passport/jwt/jwt.strategy'
import { LocalStrategy } from './application/passport/local/local.strategy'
import { JwtConfigService } from './application/passport/jwt/jwt-config.service'
import { MongoDbModule } from '../infrastructure/mongodb/mobgodb.module'
import { passwordHashProvider } from './config/password-hash.provider'
import { usersRepositoryProvider } from './config/user-repository.provider'
import { AuthenticationUseCase } from './domain/use-cases/authentication.usecase'
import { RegistrationUseCase } from './domain/use-cases/registration.usecase'
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
    AuthenticationUseCase,
    JwtAccessTokenService,
    JwtStrategy,
    LocalStrategy,
    RegistrationUseCase,
    passwordHashProvider,
    usersRepositoryProvider,
  ],
})
export class AuthenticationModule {}
