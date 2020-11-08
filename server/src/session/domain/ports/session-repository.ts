import { SessionProps } from '../model/session'

export interface SessionRepository {
  create(id: string, sessionProps: SessionProps): Promise<void>
}
