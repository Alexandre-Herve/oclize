import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { mongdbFactory } from './mongodb-factory'
import { MONGODB_CONNECTION } from '../../shared/infrastructure/constants'

@Module({
  providers: [
    {
      provide: MONGODB_CONNECTION,
      useFactory: mongdbFactory,
      inject: [ConfigService],
    },
  ],
  exports: [MONGODB_CONNECTION],
})
export class MongoDbModule {}
