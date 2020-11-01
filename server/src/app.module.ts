import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

const typegooseFactory = async (configService: ConfigService) => {
  const port = configService.get<string>('MONGODB_PORT', '27017')
  const host = configService.get<string>('MONGODB_HOST', 'localhost')
  const username = configService.get<string>('MONGODB_USERNAME', 'admin')
  const password = configService.get<string>('MONGODB_PASSWORD', 'password')
  const dbname = configService.get<string>('MONGODB_DATABASE', 'oclize')
  const uri = `mongodb://${username}:${password}@${host}:${port}/${dbname}`
  return {
    uri,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
  }
}

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typegooseFactory,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [ConfigService],
})
export class AppModule {}
