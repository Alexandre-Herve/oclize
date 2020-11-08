import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../../authentication/application/passport/jwt/jwt-auth.guard'
import { CreateSessionDto } from './dtos/create-session.dto'
// import { RenameSessionDto } from './dtos/rename-session.dto'
// import { InviteToSessionDto } from './dtos/invite-to-session.dto'
import { SessionService } from '../../domain/services/session.service'
import { SessionViewService } from './views/session-view.service'
import { isSome } from 'fp-ts/lib/Option'

@Controller('session')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(
    private sessionService: SessionService,
    private sessionViewService: SessionViewService,
  ) {}

  @Post('create')
  async create(
    @Request() req: any,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    const createdBy = req.user.id
    const createdAt = new Date()
    const createSession = { ...createSessionDto, createdBy, createdAt }
    const session = await this.sessionService.create(createSession)
    return this.sessionViewService.view(session)
  }

  @Get(':sessionId')
  async get(@Param() { sessionId }: { sessionId: string }) {
    const sessionOption = await this.sessionService.getById(sessionId)
    if (!isSome(sessionOption)) {
      throw new NotFoundException()
    }
    return this.sessionViewService.view(sessionOption.value)
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
