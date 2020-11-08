import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { CreateSessionDto } from '../../../src/session/application/api/dtos/create-session.dto'
import { v4 as uuid } from 'uuid'

export interface CreateSessionOptions {
  startTime?: Date
  name?: string
}

export const createSession = async (
  app: INestApplication,
  token: string,
  options: CreateSessionOptions = {},
) => {
  const startTime = options.startTime ?? new Date()
  const name = options.name ?? `session-name=${uuid()}`

  const createSessionDto: CreateSessionDto = {
    name,
    startTime,
  }

  const { body } = await request(app.getHttpServer())
    .post('/session/create')
    .set('Authorization', `Bearer ${token}`)
    .send(createSessionDto)
    .expect(201)

  return { id: body.id, name, startTime }
}
