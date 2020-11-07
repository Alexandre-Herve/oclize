import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../../domain/ports/session-repository'
import { SessionProps } from '../../domain/model/session'
import { Db } from 'mongodb'

@Injectable()
export class MongoDbSessionRepository implements SessionRepository {
  constructor(
    @Inject('MONGODB_CONNECTION')
    private db: Db,
  ) {}

  public async create(sessionProps: SessionProps) {
    const res = await this.db.collection('sessions').insertOne(sessionProps)
    return res.insertedId
  }
}
