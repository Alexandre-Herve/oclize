import { pick } from 'ramda'
import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../../domain/ports/session-repository'
import { Session, SessionProps } from '../../domain/model/session'
import { Db } from 'mongodb'
import { MONGODB_CONNECTION } from '../../../shared/infrastructure/constants'
import { Option, fromEither, none } from 'fp-ts/lib/Option'

const isMongoObject = (x: unknown) =>
  typeof x === 'object' && x !== null && '_id' in x

@Injectable()
export class MongoDbSessionRepository implements SessionRepository {
  constructor(
    @Inject(MONGODB_CONNECTION)
    private db: Db,
  ) {}

  public async create(sessionProps: SessionProps) {
    const { id, ...rest } = sessionProps
    const doc = { _id: id, ...rest }
    await this.db.collection('sessions').insertOne(doc)
  }

  public async getById(sessionId: string): Promise<Option<Session>> {
    const res = await this.db.collection('sessions').findOne({ _id: sessionId })
    if (!isMongoObject(res)) {
      return none
    }
    const { _id, ...rest } = res
    const params = { id: _id, ...rest }
    const session = await Session.create(params)
    return fromEither(session)
  }

  public async update(
    sessionProps: SessionProps,
    fields: (keyof SessionProps)[],
  ) {
    const update = pick(fields, sessionProps)
    await this.db
      .collection('sessions')
      .updateOne({ _id: sessionProps.id }, { $set: update })
  }
}
