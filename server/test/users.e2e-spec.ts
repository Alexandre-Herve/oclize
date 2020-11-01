import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { v4 as uuid } from 'uuid'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  describe('get profile', () => {
    describe('unauthenticated', () => {
      it('should be unauthorized', () => {
        return request(app.getHttpServer())
          .get('/users/profile')
          .expect(401)
      })
    })

    describe('authenticated', () => {
      const email = `test-${uuid()}@jeanmichel.com`
      const password = 'password'

      it('should return user profile', async () => {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send({ email, password })
          .expect(201)

        const authenticationRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password })
          .expect(201)

        const token = authenticationRes.body.access_token

        return request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect({ email })
      })
    })
  })
})
