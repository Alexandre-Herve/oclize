import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator'
import { ValueObject } from '../../../shared/model/value-object'

export enum InviteeStatus {
  Invited = 'invited',
  Accepted = 'accepted',
}

export class Invitee extends ValueObject {
  @IsString()
  userId?: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsIn(Object.values(InviteeStatus))
  status!: InviteeStatus
}
