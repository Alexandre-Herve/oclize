import { Injectable, Inject } from '@nestjs/common'
import {
  SessionRepository,
  Update,
} from '../../domain/ports/session-repository'
import { Session } from '../../domain/model/session'
import { SessionProps } from '../../domain/model/session.props'
import { Db } from 'mongodb'
import { MONGODB_CONNECTION } from '../../../shared/infrastructure/constants'
import { Option, fromEither, none } from 'fp-ts/lib/Option'

const isMongoObject = (x: unknown) =>
  typeof x === 'object' && x !== null && '_id' in x

const SESSIONS = 'sessions'

@Injectable()
export class MongoDbSessionRepository implements SessionRepository {
  constructor(
    @Inject(MONGODB_CONNECTION)
    private db: Db,
  ) {}

  public async create(sessionProps: SessionProps) {
    const { id, ...rest } = sessionProps
    const doc = { _id: id, ...rest }
    await this.db.collection(SESSIONS).insertOne(doc)
  }

  public async getById(sessionId: string): Promise<Option<Session>> {
    const res = await this.db.collection(SESSIONS).findOne({ _id: sessionId })
    if (!isMongoObject(res)) {
      return none
    }
    const { _id, ...rest } = res
    const params = { id: _id, ...rest }
    const session = await Session.create(params)
    return fromEither(session)
  }

  public async update(sessionId: string, sessionUpdate: Update<SessionProps>) {
    await this.db
      .collection(SESSIONS)
      .updateOne({ _id: sessionId }, { $set: sessionUpdate })
  }

  public async remove(sessionId: string) {
    await this.db.collection(SESSIONS).deleteOne({ _id: sessionId })
  }
}
