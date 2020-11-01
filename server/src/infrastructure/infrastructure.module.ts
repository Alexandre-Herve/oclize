import { Module } from '@nestjs/common'
import { MongoDbModule } from './mongodb/mobgodb.module'

@Module({
  imports: [MongoDbModule],
})
export class InfrastructureModule {}
