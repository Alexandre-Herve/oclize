import { Module } from '@nestjs/common'
import { SessionController } from './application/api/session.controller'
import { MongoDbModule } from '../infrastructure/mongodb/mobgodb.module'
import { idServiceProvider } from './config/id-service.provider'
import { sessionRepositoryProvider } from './config/session-repository.provider'
import { SessionViewService } from './application/api/views/session-view.service'
import { InviteeViewService } from './application/api/views/invitee-view.service'
import { GetSessionUseCase } from './domain/use-cases/get-session.usecase'
import { CreateSessionUseCase } from './domain/use-cases/create-session.usecase'
import { RemoveSessionUseCase } from './domain/use-cases/remove-session.usecase'
import { UpdateSessionUseCase } from './domain/use-cases/update-session.usecase'

@Module({
  controllers: [SessionController],
  imports: [MongoDbModule],
  providers: [
    CreateSessionUseCase,
    GetSessionUseCase,
    InviteeViewService,
    RemoveSessionUseCase,
    SessionViewService,
    UpdateSessionUseCase,
    idServiceProvider,
    sessionRepositoryProvider,
  ],
})
export class SessionModule {}
