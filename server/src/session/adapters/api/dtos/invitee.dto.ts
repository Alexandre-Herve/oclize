import { InviteeStatus } from '../../../domain/model/invitee'

export interface InviteeDto {
  userId?: string
  email: string
  status: InviteeStatus
}
