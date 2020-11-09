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

  @IsDate()
  readonly createdAt!: Date

  @IsNotEmpty()
  @IsString()
  readonly name!: string

  @ValidateNested()
  readonly invitees!: Invitee[]

  @IsDate()
  readonly startTime!: Date
}

export type SessionUpdate = Partial<Pick<SessionProps, 'startTime' | 'name'>>

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

  public async update(sessionUpdate: SessionUpdate): Promise<boolean> {
    const newProps = { ...this.props, ...sessionUpdate }
    const sessionProps = SessionProps.create<SessionProps>(newProps)
    const errors = await validate(sessionProps)
    if (errors.length > 0) {
      return false
    }
    this.props = sessionProps
    return true
  }

  public async remove() {
    throw new Error('not implemented')
  }
}
