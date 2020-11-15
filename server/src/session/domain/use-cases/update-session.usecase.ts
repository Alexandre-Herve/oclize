import { isLeft } from 'fp-ts/lib/Either'
import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../ports/session-repository'
import { Session } from '../model/session'
import { SessionUpdate } from '../model/session.update'
import { SESSION_REPOSITORY } from '../ports/constants'
import { isNone } from 'fp-ts/lib/Option'
import { Either, mapLeft, left, right } from 'fp-ts/lib/Either'
import { InvalidReason } from '../../../shared/model/errors'
import { NotFound, Forbidden, Invalid } from '../../../shared/use-cases/errors'

export type UpdateError = NotFound | Forbidden | Invalid

@Injectable()
export class UpdateSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private sessionRepository: SessionRepository,
  ) {}

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
}
