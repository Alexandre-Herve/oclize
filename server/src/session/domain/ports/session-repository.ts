import { Session } from '../model/session'
import { SessionProps } from '../model/session.props'
import { Option } from 'fp-ts/lib/Option'

export type Update<T> = Partial<Exclude<T, 'id'>>

export interface SessionRepository {
  create(sessionProps: SessionProps): Promise<void>
  getById(sessionId: string): Promise<Option<Session>>
  remove(sessionId: string): Promise<void>
  update(sessionId: string, props: Update<SessionProps>): Promise<void>
}
