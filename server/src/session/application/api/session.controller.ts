import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../../authentication/application/passport/jwt/jwt-auth.guard'
import { CreateSessionDto } from './dtos/create-session.dto'
import { UpdateSessionDto } from './dtos/update-session.dto'
// import { InviteToSessionDto } from './dtos/invite-to-session.dto'
import { GetSessionUseCase } from '../../domain/use-cases/get-session.usecase'
import { CreateSessionUseCase } from '../../domain/use-cases/create-session.usecase'
import { RemoveSessionUseCase } from '../../domain/use-cases/remove-session.usecase'
import { UpdateSessionUseCase } from '../../domain/use-cases/update-session.usecase'
import { SessionViewService } from './views/session-view.service'
import { isRight, isLeft } from 'fp-ts/lib/Either'
import { isNone } from 'fp-ts/lib/Option'

@Controller('session')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(
    private updateSessionUseCase: UpdateSessionUseCase,
    private createSessionUseCase: CreateSessionUseCase,
    private removeSessionUseCase: RemoveSessionUseCase,
    private getSessionUseCase: GetSessionUseCase,
    private sessionViewService: SessionViewService,
  ) {}

  @Post('create')
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @Request() req: any,
  ) {
    const createdBy = req.user.id
    const createdAt = new Date()
    const createSession = { ...createSessionDto, createdBy, createdAt }
    const sessionOption = await this.createSessionUseCase.create(createSession)
    if (isLeft(sessionOption)) {
      throw new BadRequestException()
    }
    return this.sessionViewService.view(sessionOption.right)
  }

  @Get(':sessionId')
  async get(
    @Param() { sessionId }: { sessionId: string },
    @Request() req: any,
  ) {
    const requestAuthor = req.user.id
    const sessionOption = await this.getSessionUseCase.getById(
      sessionId,
      requestAuthor,
    )
    if (isNone(sessionOption)) {
      throw new NotFoundException()
    }
    return this.sessionViewService.view(sessionOption.value)
  }

  @Post(':sessionId/update')
  async update(
    @Body() updateSessionDto: UpdateSessionDto,
    @Param() { sessionId }: { sessionId: string },
    @Request() req: any,
  ) {
    const requestAuthor = req.user.id
    const res = await this.updateSessionUseCase.update(
      sessionId,
      requestAuthor,
      updateSessionDto,
    )
    if (isRight(res)) {
      return true
    }
    const reason = res.left
    if (reason.type === 'not_found' || reason.type === 'forbidden') {
      throw new NotFoundException()
    } else {
      throw new BadRequestException()
    }
  }

  @Delete(':sessionId')
  async delete(
    @Param() { sessionId }: { sessionId: string },
    @Request() req: any,
  ) {
    const requestAuthor = req.user.id
    const res = await this.removeSessionUseCase.remove(sessionId, requestAuthor)
    if (isRight(res)) {
      return true
    }
    const reason = res.left
    if (reason.type === 'not_found' || reason.type === 'forbidden') {
      throw new NotFoundException()
    } else {
      throw new InternalServerErrorException()
    }
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
