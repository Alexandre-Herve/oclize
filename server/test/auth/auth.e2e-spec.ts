import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { v4 as uuid } from 'uuid'

describe('AppController (e2e)', () => {
  let app: INestApplication
  const password = 'password'

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    await app.init()
  })

  describe('register', () => {
    describe('when the email is invalid', () => {
      const email = 'invalidemail'

      it('should fail to create an account', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({ email, password })
          .expect(400)
      })
    })

    describe('when the email is new', () => {
      const email = `test=${uuid()}@jeanmichel.com`

      it('should succeed to create an account', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({ email, password })
          .expect(201)
      })
    })

    describe('when the email already exists', () => {
      const email = `test=${uuid()}@jeanmichel.com`

      beforeEach(async () => {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send({ email, password })
      })

      it('should fail to create an account', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({ email, password })
          .expect(403)
      })
    })
  })
})
