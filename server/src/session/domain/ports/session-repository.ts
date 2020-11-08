import { Session, SessionProps } from '../model/session'
import { Option } from 'fp-ts/lib/Option'

export interface SessionRepository {
  create(sessionProps: SessionProps): Promise<void>
  getById(sessionId: string): Promise<Option<Session>>
}
