import { isLeft } from 'fp-ts/lib/Either'
import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../ports/session-repository'
import { IdService } from '../ports/id.service'
import { Session, SessionProps } from '../model/session'
import { EVENT_REPOSITORY, ID_SERVICE } from '../ports/constants'
import { Option, isNone } from 'fp-ts/lib/Option'
import { Either, left, right } from 'fp-ts/lib/Either'

type CreateSession = Omit<SessionProps, 'invitees' | 'id'>

@Injectable()
export class SessionService {
  constructor(
    @Inject(EVENT_REPOSITORY) private sessionRepository: SessionRepository,
    @Inject(ID_SERVICE) private idService: IdService,
  ) {}

  async create(createSession: CreateSession): Promise<Session> {
    const id = this.idService.newId()
    const sessionProps = { ...createSession, id, invitees: [] }
    const sessionResult = await Session.create(sessionProps)
    if (isLeft(sessionResult)) {
      throw new Error('Failed to create session')
    }
    const session = sessionResult.right
    await this.sessionRepository.create(session.props)
    return session
  }

  async getById(sessionId: string): Promise<Option<Session>> {
    return this.sessionRepository.getById(sessionId)
  }

  async rename(
    sessionId: string,
    newName: string,
  ): Promise<Either<string, Session>> {
    const sessionOption = await this.sessionRepository.getById(sessionId)
    if (isNone(sessionOption)) {
      return left('not found')
    }
    const session = sessionOption.value
    const renameValid = await session.rename(newName)
    if (!renameValid) {
      return left('invalid request')
    }
    await this.sessionRepository.update(session.props, ['name'])
    return right(session)
  }
}
