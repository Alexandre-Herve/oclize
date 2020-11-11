import { SessionProps } from './session.props'

export type SessionUpdate = Partial<Pick<SessionProps, 'startTime' | 'name'>>
