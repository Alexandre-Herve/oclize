import { isLeft } from 'fp-ts/lib/Either'
import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../ports/session-repository'
import { IdService } from '../ports/id.service'
import { Session } from '../model/session'
import { SessionProps } from '../model/session.props'
import { SessionUpdate } from '../model/session.update'
import { SESSION_REPOSITORY, ID_SERVICE } from '../ports/constants'
import { Option, isNone, none } from 'fp-ts/lib/Option'
import { Either, mapLeft, left, right } from 'fp-ts/lib/Either'
import { InvalidReason } from '../../../shared/model/errors'

export type CreateSession = Omit<SessionProps, 'invitees' | 'id'>

export type NotFound = {
  type: 'not_found'
}

export type Forbidden = {
  type: 'forbidden'
}

export type Invalid = {
  type: 'invalid'
  reasons: InvalidReason[]
}

export type UpdateError = NotFound | Forbidden | Invalid
export type CreateError = Invalid
export type RemoveError = NotFound | Forbidden

@Injectable()
export class SessionService {
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
  ): Promise<Either<UpdateError, Session>> {
    const sessionOption = await this.sessionRepository.getById(sessionId)
    if (isNone(sessionOption)) {
      return left({ type: 'not_found' })
    }

    const session = sessionOption.value

    const requestedByAuthor = requestAuthor === session.props.createdBy
    if (!requestedByAuthor) {
      return left({ type: 'forbidden' })
    }

    const updateResult = await session.update(sessionUpdate)
    if (isLeft(updateResult)) {
      return mapLeft<InvalidReason[], UpdateError>((reasons) => ({
        type: 'invalid',
        reasons,
      }))(updateResult)
    }

    await this.sessionRepository.update(session.props.id, sessionUpdate)
    return right(updateResult.right)
  }

  async remove(
    sessionId: string,
    requestAuthor: string,
  ): Promise<Either<RemoveError, Session>> {
    const sessionOption = await this.sessionRepository.getById(sessionId)
    if (isNone(sessionOption)) {
      return left({ type: 'not_found' })
    }

    const session = sessionOption.value

    const requestedByAuthor = requestAuthor === session.props.createdBy
    if (!requestedByAuthor) {
      return left({ type: 'forbidden' })
    }
    await this.sessionRepository.remove(session.props.id)
    return right(session)
  }
}
