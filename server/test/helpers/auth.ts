import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { v4 as uuid } from 'uuid'

export interface AuthOptions {
  email?: string
  password?: string
}

export const register = async (
  app: INestApplication,
  options: AuthOptions = {},
) => {
  const email = options.email ?? `jean-michel-${uuid()}@test.com`
  const password = options.password ?? 'password'

  const registerRes = await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password })
    .expect(201)

  const userId = registerRes.body
  return { email, password, userId }
}

export const login = async (
  app: INestApplication,
  { email, password }: { email: string; password: string },
) => {
  const authenticationRes = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(201)

  const token = authenticationRes.body.access_token as string
  return { token }
}

export const authenticate = async (
  app: INestApplication,
  options: AuthOptions = {},
) => {
  const { email, password, userId } = await register(app, options)
  const { token } = await login(app, { email, password })
  return { token, email, password, userId }
}

export const getUniqueToken = async (app: INestApplication, email: string) => {
  const res = await request(app.getHttpServer())
    .post('/auth/requestUniqueToken')
    .send({ email })
    .expect(201)

  // TODO: intercept email

  return res.body.unique_token
}
