import { InviteeDto } from './invitee.dto'

export interface SessionDto {
  readonly createdBy: string
  readonly id: string
  readonly invitees: InviteeDto[]
  readonly name: string
  readonly startTime: Date
}
