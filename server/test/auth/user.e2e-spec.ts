import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { authenticate } from '../helpers/auth'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    await app.init()
  })

  describe('get profile', () => {
    describe('unauthenticated', () => {
      it('should be unauthorized', () => {
        return request(app.getHttpServer())
          .get('/auth/profile')
          .expect(401)
      })
    })

    describe('authenticated', () => {
      it('should return user profile', async () => {
        const { token, email } = await authenticate(app)
        return request(app.getHttpServer())
          .get('/auth/profile')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => res.body.email === email && res.body.id)
      })
    })
  })
})
