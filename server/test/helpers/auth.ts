import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { v4 as uuid } from 'uuid'

export interface AuthOptions {
  email?: string
  password?: string
}

export const authenticate = async (
  app: INestApplication,
  options: AuthOptions = {},
) => {
  const email = options?.email ?? `jean-michel-${uuid()}@test.com`
  const password = options?.password ?? 'password'

  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password })
    .expect(201)

  const authenticationRes = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(201)

  const token = authenticationRes.body.access_token
  return { token, email, password }
}
