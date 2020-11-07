import { SessionProps } from '../model/session'

export interface SessionRepository {
  create(sessionProps: SessionProps): Promise<string>
}
