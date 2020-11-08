import { Injectable } from '@nestjs/common'
import { Session } from '../../../domain/model/session'
import { SessionDto } from '../dtos/session.dto'
import { InviteeViewService } from './invitee-view.service'

@Injectable()
export class SessionViewService {
  constructor(private inviteeViewService: InviteeViewService) {}

  public view(session: Session): SessionDto {
    const { name, startTime, invitees, createdBy } = session.props
    const { id } = session
    const viewedInvitees = invitees.map(this.inviteeViewService.view)
    return {
      createdBy,
      id,
      invitees: viewedInvitees,
      name,
      startTime,
    }
  }
}
