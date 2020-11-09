import { keys } from 'ramda'
import { isLeft } from 'fp-ts/lib/Either'
import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../ports/session-repository'
import { IdService } from '../ports/id.service'
import { Session, SessionProps, SessionUpdate } from '../model/session'
import { EVENT_REPOSITORY, ID_SERVICE } from '../ports/constants'
import { Option, isNone, none, some } from 'fp-ts/lib/Option'
import { Either, left, right } from 'fp-ts/lib/Either'

type CreateSession = Omit<SessionProps, 'invitees' | 'id'>

@Injectable()
export class SessionService {
  constructor(
    @Inject(EVENT_REPOSITORY) private sessionRepository: SessionRepository,
    @Inject(ID_SERVICE) private idService: IdService,
  ) {}

  async create(createSession: CreateSession): Promise<Option<Session>> {
    const id = this.idService.newId()
    const sessionProps = { ...createSession, id, invitees: [] }
    const sessionResult = await Session.create(sessionProps)
    if (isLeft(sessionResult)) {
      return none
    }
    const session = sessionResult.right
    await this.sessionRepository.create(session.props)
    return some(session)
  }

  async getById(
    sessionId: string,
    requestAuthor: string,
  ): Promise<Option<Session>> {
    const sessionOption = await this.sessionRepository.getById(sessionId)
    if (isNone(sessionOption)) {
      return none
    }
    const session = sessionOption.value
    const requestedByAuthor = requestAuthor === session.props.createdBy
    if (!requestedByAuthor) {
      return none
    }
    return sessionOption
  }

  async update(
    sessionId: string,
    requestAuthor: string,
    sessionUpdate: SessionUpdate,
  ): Promise<Either<string, Session>> {
    const sessionOption = await this.sessionRepository.getById(sessionId)
    if (isNone(sessionOption)) {
      return left('not found')
    }

    const session = sessionOption.value

    const requestedByAuthor = requestAuthor === session.props.createdBy
    if (!requestedByAuthor) {
      return left('unauthorized')
    }

    const updateValid = await session.update(sessionUpdate)
    if (!updateValid) {
      return left('invalid request')
    }

    const updateKeys = keys(sessionUpdate)
    await this.sessionRepository.update(session.props, updateKeys)
    return right(session)
  }
}
