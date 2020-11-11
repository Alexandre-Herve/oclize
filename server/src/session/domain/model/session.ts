import { left, right, Either } from 'fp-ts/lib/Either'
import { ValidationError, validate } from 'class-validator'
import { AggregateRoot } from '../../../shared/model/aggregate-root'
import { isPast } from '../helpers/is-past'
import { SessionProps } from './session.props'
import { SessionUpdate } from './session.update'

export class Session extends AggregateRoot<SessionProps> {
  private constructor(props: SessionProps) {
    super(props)
  }
  public static async create(
    props: SessionProps,
  ): Promise<Either<ValidationError[], Session>> {
    const sessionProps = SessionProps.create<SessionProps>(props)
    if (isPast(sessionProps.startTime)) {
      return left([])
    }
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
    if (sessionUpdate.startTime) {
      const sessionStartTime = this.props.startTime
      if (isPast(sessionStartTime) || isPast(sessionUpdate.startTime)) {
        return false
      }
    }
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
