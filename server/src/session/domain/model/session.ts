import { left, right, Either } from 'fp-ts/lib/Either'
import {
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
  ValidationError,
  validateSync,
} from 'class-validator'
import { AggregateRoot } from '../../../shared/model/aggregate-root'
import { ValueObject } from '../../../shared/model/value-object'
import { Invitee } from './invitee'

export class SessionProps extends ValueObject {
  @IsNotEmpty()
  @IsString()
  createdBy!: string

  @IsNotEmpty()
  @IsDate()
  createdAt!: Date

  @IsNotEmpty()
  @IsString()
  name!: string

  @ValidateNested()
  invitees!: Invitee[]

  @IsDate()
  @IsNotEmpty()
  startTime!: Date
}

export class Session extends AggregateRoot<SessionProps> {
  private constructor(id: string, props: SessionProps) {
    super(id, props)
  }

  public static create(
    id: string,
    props: SessionProps,
  ): Either<ValidationError[], Session> {
    const sessionProps = SessionProps.create<SessionProps>(props)
    const errors = validateSync(sessionProps)
    if (errors.length > 0) {
      return left(errors)
    }
    const session = new Session(id, sessionProps)
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
