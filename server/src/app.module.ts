import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://admin:password@mongodb:27017/oclize', {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }),
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  providers: [AppService],
})
export class AppModule {}
