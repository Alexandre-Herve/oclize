import { Test, TestingModule } from '@nestjs/testing'
import { SessionService } from './session.service'
import { Session } from '../model/session'
import { SessionProps } from '../model/session.props'
import { Option, fromEither, none } from 'fp-ts/lib/Option'
import { SESSION_REPOSITORY } from '../ports/constants'
import { SessionRepository, Update } from '../ports/session-repository'
import { idServiceProvider } from '../../config/id-service.provider'

export class InMemorySessionRepository implements SessionRepository {
  private sessions: SessionProps[] = []

  async create(sessionProps: SessionProps): Promise<void> {
    this.sessions.push(sessionProps)
  }

  async getById(sessionId: string): Promise<Option<Session>> {
    const found = this.sessions.find((s) => s.id === sessionId)
    if (!found) {
      return none
    }
    const session = await Session.create(found)
    return fromEither(session)
  }

  async update(
    sessionId: string,
    sessionUpdate: Update<SessionProps>,
  ): Promise<void> {
    const foundIndex = this.sessions.findIndex((s) => s.id === sessionId)
    if (foundIndex < 0) {
      return
    }
    const session = this.sessions[foundIndex]
    const updatedSession = { ...session, ...sessionUpdate }
    this.sessions = [
      ...this.sessions.slice(0, foundIndex),
      updatedSession,
      ...this.sessions.slice(foundIndex + 1),
    ]
  }
}

const sessionRepositoryProvider = {
  provide: SESSION_REPOSITORY,
  useClass: InMemorySessionRepository,
}

describe('SessionService', () => {
  let service: SessionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionService, idServiceProvider, sessionRepositoryProvider],
    }).compile()

    service = module.get<SessionService>(SessionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
