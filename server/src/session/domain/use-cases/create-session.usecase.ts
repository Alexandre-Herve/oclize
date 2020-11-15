import { isLeft } from 'fp-ts/lib/Either'
import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../ports/session-repository'
import { IdService } from '../ports/id.service'
import { Session } from '../model/session'
import { SessionProps } from '../model/session.props'
import { SESSION_REPOSITORY, ID_SERVICE } from '../ports/constants'
import { Either, mapLeft, right } from 'fp-ts/lib/Either'
import { InvalidReason } from '../../../shared/model/errors'
import { Invalid } from '../../../shared/use-cases/errors'

export type CreateSession = Omit<SessionProps, 'invitees' | 'id'>

export type CreateError = Invalid

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private sessionRepository: SessionRepository,
    @Inject(ID_SERVICE) private idService: IdService,
  ) {}

  async create(
    createSession: CreateSession,
  ): Promise<Either<CreateError, Session>> {
    const id = this.idService.newId()
    const sessionProps = { ...createSession, id, invitees: [] }
    const sessionResult = await Session.create(sessionProps)
    if (isLeft(sessionResult)) {
      return mapLeft<InvalidReason[], CreateError>((reasons) => ({
        type: 'invalid',
        reasons,
      }))(sessionResult)
    }
    const session = sessionResult.right
    await this.sessionRepository.create(session.props)
    return right(session)
  }
}
