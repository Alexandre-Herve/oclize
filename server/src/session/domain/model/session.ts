import { left, right, Either } from 'fp-ts/lib/Either'
import { validate } from 'class-validator'
import { AggregateRoot } from '../../../shared/model/aggregate-root'
import { isPast } from '../helpers/is-past'
import { SessionProps } from './session.props'
import { SessionUpdate } from './session.update'
import {
  InvalidReason,
  validateErrorToReason,
} from '../../../shared/model/errors'

export class Session extends AggregateRoot<SessionProps> {
  private constructor(props: SessionProps) {
    super(props)
  }
  public static async create(
    props: SessionProps,
  ): Promise<Either<InvalidReason[], Session>> {
    const sessionProps = SessionProps.create<SessionProps>(props)
    if (isPast(sessionProps.startTime)) {
      return left([
        {
          property: 'startTime',
          message: 'A session must be created with a future startTime.',
        },
      ])
    }
    const errors = await validate(sessionProps)
    if (errors.length > 0) {
      return left(errors.map(validateErrorToReason))
    }
    const session = new Session(sessionProps)
    return right(session)
  }

  public async invite(_email: string) {
    throw new Error('not implemented')
  }

  public async update(
    sessionUpdate: SessionUpdate,
  ): Promise<Either<InvalidReason[], Session>> {
    if (sessionUpdate.startTime) {
      const sessionStartTime = this.props.startTime
      if (isPast(sessionStartTime)) {
        return left([
          {
            property: 'startTime',
            message:
              'A session startTime cannot be updated after it has started.',
          },
        ])
      }
      if (isPast(sessionUpdate.startTime)) {
        return left([
          {
            property: 'startTime',
            message: 'A session must be updated with a future startTime.',
          },
        ])
      }
    }
    const newProps = { ...this.props, ...sessionUpdate }
    const sessionProps = SessionProps.create<SessionProps>(newProps)
    const errors = await validate(sessionProps)
    if (errors.length > 0) {
      return left(errors.map(validateErrorToReason))
    }
    this.props = sessionProps
    return right(this)
  }
}
