import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { AuthenticationModule } from './authentication/authentication.module'

@Module({
  imports: [
    AuthenticationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    InfrastructureModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
