import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { InfrastructureModule } from './infrastructure/infrastructure.module'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    InfrastructureModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
