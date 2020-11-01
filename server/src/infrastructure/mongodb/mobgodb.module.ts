import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { mongdbFactory } from './mongodb-factory'

@Module({
  providers: [
    {
      provide: 'MONGODB_CONNECTION',
      useFactory: mongdbFactory,
      inject: [ConfigService],
    },
  ],
  exports: ['MONGODB_CONNECTION'],
})
export class MongoDbModule {}
