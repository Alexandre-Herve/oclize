import { Injectable, Inject } from '@nestjs/common'
import { UserRepository } from '../../domain/ports/user-repository'
import { CreateUserDto } from '../../domain/ports/create-user.dto'
import { Db } from 'mongodb'

@Injectable()
export class MongoDbUserRepository implements UserRepository {
  constructor(
    @Inject('MONGODB_CONNECTION')
    private db: Db,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const res = await this.db.collection('users').insertOne(createUserDto)
    return res.insertedId
  }

  public async getByEmail(email: string) {
    const res = await this.db.collection('users').findOne({ email })
    return res ?? null
  }
}
