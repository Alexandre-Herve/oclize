import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from './../../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { authenticate } from '../helpers/auth'
import { createSession } from './helpers/create'

describe('SessionController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, forbidUnknownValues: true }),
    )
    await app.init()
  })

  describe('remove', () => {
    let id: string | undefined = undefined
    let token: string | undefined = undefined

    beforeEach(async () => {
      const authRes = await authenticate(app)
      token = authRes.token
      // userId = authRes.userId

      const res = await createSession(app, token)
      id = res.id
    })

    it('should remove a session', async () => {
      await request(app.getHttpServer())
        .delete(`/session/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200)

      await request(app.getHttpServer())
        .get(`/session/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(404)
    })

    describe('with other user token', () => {
      let otherToken: string | undefined = undefined

      beforeEach(async () => {
        const authRes = await authenticate(app)
        otherToken = authRes.token
      })

      it('should not remove a session', async () => {
        await request(app.getHttpServer())
          .delete(`/session/${id}`)
          .set('Authorization', `Bearer ${otherToken}`)
          .send()
          .expect(404)

        await request(app.getHttpServer())
          .get(`/session/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send()
          .expect(200)
      })
    })
  })
})
