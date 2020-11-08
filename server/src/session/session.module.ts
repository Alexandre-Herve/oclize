import { Module } from '@nestjs/common'
import { SessionController } from './application/api/session.controller'
import { MongoDbModule } from '../infrastructure/mongodb/mobgodb.module'
import { idServiceProvider } from './config/id-service.provider'
import { sessionRepositoryProvider } from './config/session-repository.provider'
import { SessionService } from './domain/services/session.service'
import { SessionViewService } from './application/api/views/session-view.service'
import { InviteeViewService } from './application/api/views/invitee-view.service'

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
