import { left, right, Either } from 'fp-ts/lib/Either'
import {
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
  ValidationError,
  validate,
} from 'class-validator'
import { AggregateRoot } from '../../../shared/model/aggregate-root'
import { EntityProps } from '../../../shared/model/entity-props'
import { Invitee } from './invitee'

export class SessionProps extends EntityProps {
  @IsNotEmpty()
  @IsString()
  readonly createdBy!: string

  @IsNotEmpty()
  @IsDate()
  readonly createdAt!: Date

  @IsNotEmpty()
  @IsString()
  readonly name!: string

  @ValidateNested()
  readonly invitees!: Invitee[]

  @IsDate()
  @IsNotEmpty()
  readonly startTime!: Date
}

export class Session extends AggregateRoot<SessionProps> {
  public static async create(
    props: SessionProps,
  ): Promise<Either<ValidationError[], Session>> {
    const sessionProps = SessionProps.create<SessionProps>(props)
    const errors = await validate(sessionProps)
    if (errors.length > 0) {
      return left(errors)
    }
    const session = new Session(sessionProps)
    return right(session)
  }

  public async invite(_email: string) {
    throw new Error('not implemented')
  }
  public async rename(_name: string) {
    throw new Error('not implemented')
  }
  public async move() {
    throw new Error('not implemented')
  }
  public async remove() {
    throw new Error('not implemented')
  }
}
