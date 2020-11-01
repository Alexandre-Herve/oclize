import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { typegooseConnexionFactory } from './typegoose-connexion-factory'

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typegooseConnexionFactory,
      inject: [ConfigService],
    }),
  ],
})
export class TypegooseConnexionModule {}
