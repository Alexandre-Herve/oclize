import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../ports/session-repository'
import { Session } from '../model/session'
import { SESSION_REPOSITORY } from '../ports/constants'
import { Option, isNone, none } from 'fp-ts/lib/Option'

@Injectable()
export class GetSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private sessionRepository: SessionRepository,
  ) {}

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
}
