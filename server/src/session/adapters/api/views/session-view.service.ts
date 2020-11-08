import { Injectable } from '@nestjs/common'
import { Session } from '../../../domain/model/session'
import { SessionDto } from '../dtos/session.dto'

@Injectable()
export class SessionViewService {
  public view(session: Session): SessionDto {
    const { name, startTime } = session.props
    const { id } = session
    return { name, startTime, id }
  }
}
