import { Module } from '@nestjs/common'
import { SessionController } from './adapters/api/session.controller'
import { MongoDbModule } from '../infrastructure/mongodb/mobgodb.module'
import { idServiceProvider } from './config/id-service.provider'
import { sessionRepositoryProvider } from './config/session-repository.provider'
import { SessionService } from './domain/domain-services/session.service'

@Module({
  controllers: [SessionController],
  imports: [MongoDbModule],
  providers: [sessionRepositoryProvider, SessionService, idServiceProvider],
})
export class SessionModule {}
