import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../ports/session-repository'
import { Session } from '../model/session'
import { SESSION_REPOSITORY } from '../ports/constants'
import { isNone } from 'fp-ts/lib/Option'
import { Either, left, right } from 'fp-ts/lib/Either'
import { NotFound, Forbidden } from '../../../shared/use-cases/errors'

export type RemoveError = NotFound | Forbidden

@Injectable()
export class RemoveSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private sessionRepository: SessionRepository,
  ) {}

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
