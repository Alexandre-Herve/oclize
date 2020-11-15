import { Injectable, Inject } from '@nestjs/common'
import { UNIQUE_TOKEN_SERVICE, USER_REPOSITORY } from '../ports/constants'
import { UniqueTokenService } from '../ports/unique-token.service'
import { UserRepository } from '../ports/user-repository'
import { isNone } from 'fp-ts/lib/Option'
import { isLeft } from 'fp-ts/lib/Either'

@Injectable()
export class RequestUniqueTokenUseCase {
  constructor(
    @Inject(UNIQUE_TOKEN_SERVICE)
    private uniqueTokenService: UniqueTokenService,
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepository,
  ) {}

  public async requestUniqueToken(email: string): Promise<boolean> {
    // retrive user
    const userOption = await this.userRepository.getByEmail(email)
    if (isNone(userOption)) {
      return false
    }
    const user = userOption.value

    // generate unique token
    const id = this.uniqueTokenService.getUniqueToken()
    const now = new Date()
    const uniqueTokenParams = { id, createdAt: now }

    // save token to user
    const userResult = await user.update({ uniqueToken: uniqueTokenParams })
    if (isLeft(userResult)) {
      return false
    }

    await this.userRepository.update(user.props.id, {
      uniqueToken: uniqueTokenParams,
    })

    // TODO: send email

    return true
  }
}
