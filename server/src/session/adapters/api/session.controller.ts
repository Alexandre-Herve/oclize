import {
  Body,
  Controller,
  // Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../../authentication/adapters/passport/jwt/jwt-auth.guard'
import { CreateSessionDto } from './dtos/create-session.dto'
// import { RenameSessionDto } from './dtos/rename-session.dto'
// import { InviteToSessionDto } from './dtos/invite-to-session.dto'
import { SessionService } from '../../domain/domain-services/session.service'

@Controller('session')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('create')
  async register(@Request() req: any, @Body() createSessionDto: CreateSessionDto) {
    const createdBy = req.user.id
    const createdAt = new Date()
    const createSession = { ...createSessionDto, createdBy, createdAt }
    this.sessionService.create(createSession)
  }

  /*
   *   @Post(':sessionId/rename')
   *   async rename(
   *     @Param() params: { sessionId: string },
   *     @Body() renameSessionDto: RenameSessionDto,
   *   ) {}
   *
   *   @Post(':sessionId/invite')
   *   async invite(
   *     @Param() params: { sessionId: string },
   *     @Body() inviteToSessionDto: InviteToSessionDto,
   *   ) {}
   *
   *   @Post(':sessionId/remove')
   *   async remove(@Param() params: { sessionId: string }) {}
   */
}