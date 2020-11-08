import { Module } from '@nestjs/common'
import { SessionController } from './adapters/api/session.controller'
import { MongoDbModule } from '../infrastructure/mongodb/mobgodb.module'
import { idServiceProvider } from './config/id-service.provider'
import { sessionRepositoryProvider } from './config/session-repository.provider'
import { SessionService } from './domain/services/session.service'
import { SessionViewService } from './adapters/api/views/session-view.service'
import { InviteeViewService } from './adapters/api/views/invitee-view.service'

@Module({
  controllers: [SessionController],
  imports: [MongoDbModule],
  providers: [
    InviteeViewService,
    SessionService,
    SessionViewService,
    idServiceProvider,
    sessionRepositoryProvider,
  ],
})
export class SessionModule {}
