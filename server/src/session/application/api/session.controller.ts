import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../../authentication/application/passport/jwt/jwt-auth.guard'
import { CreateSessionDto } from './dtos/create-session.dto'
import { RenameSessionDto } from './dtos/rename-session.dto'
// import { InviteToSessionDto } from './dtos/invite-to-session.dto'
import { SessionService } from '../../domain/services/session.service'
import { SessionViewService } from './views/session-view.service'
import { isSome } from 'fp-ts/lib/Option'
import { isLeft } from 'fp-ts/lib/Either'

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

  // TODO: permissions
  @Get(':sessionId')
  async get(@Param() { sessionId }: { sessionId: string }) {
    const sessionOption = await this.sessionService.getById(sessionId)
    if (!isSome(sessionOption)) {
      throw new NotFoundException()
    }
    return this.sessionViewService.view(sessionOption.value)
  }

  // TODO: permissions
  @Post(':sessionId/rename')
  async rename(
    @Param() { sessionId }: { sessionId: string },
    @Body() renameSessionDto: RenameSessionDto,
  ) {
    const res = await this.sessionService.rename(
      sessionId,
      renameSessionDto.name,
    )
    if (isLeft(res)) {
      throw new BadRequestException()
    }
    return true
  }

  /*
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
