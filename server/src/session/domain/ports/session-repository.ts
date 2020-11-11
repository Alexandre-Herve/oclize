import { Session, SessionProps } from '../model/session'
import { Option } from 'fp-ts/lib/Option'

export type Update<T> = Partial<Exclude<T, 'id'>>

export interface SessionRepository {
  create(sessionProps: SessionProps): Promise<void>
  getById(sessionId: string): Promise<Option<Session>>
  update(sessionId: string, props: Update<SessionProps>): Promise<void>
}
