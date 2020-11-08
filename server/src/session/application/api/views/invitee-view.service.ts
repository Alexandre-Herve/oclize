import { Injectable } from '@nestjs/common'
import { Invitee } from '../../../domain/model/invitee'
import { InviteeDto } from '../dtos/invitee.dto'

@Injectable()
export class InviteeViewService {
  public view(invitee: Invitee): InviteeDto {
    const { email, status, userId } = invitee
    return { email, status, userId }
  }
}
