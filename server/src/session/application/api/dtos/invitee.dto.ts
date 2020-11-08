import { InviteeStatus } from '../../../domain/model/invitee'

export interface InviteeDto {
  readonly email: string
  readonly status: InviteeStatus
  readonly userId?: string
}
