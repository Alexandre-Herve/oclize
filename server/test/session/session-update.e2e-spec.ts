import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from './../../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { authenticate } from '../helpers/auth'
import { createSession } from './helpers/create'
import { v4 as uuid } from 'uuid'

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

  describe('update', () => {
    let id: string | undefined = undefined
    let token: string | undefined = undefined
    let startTime: Date | undefined = undefined

    beforeEach(async () => {
      const authRes = await authenticate(app)
      token = authRes.token

      const res = await createSession(app, token)
      id = res.id
      startTime = res.startTime
    })

    describe('with a valid name', () => {
      it('should rename a session', async () => {
        const newName = `newName-${uuid}`

        await request(app.getHttpServer())
          .post(`/session/${id}/update`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: newName })
          .expect(201)

        const { body } = await request(app.getHttpServer())
          .get(`/session/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send()
          .expect(200)

        expect(body.name).toBe(newName)
      })
    })

    describe('with a valid startTime', () => {
      it('should update a session startTime', async () => {
        const newStartTime = new Date()

        await request(app.getHttpServer())
          .post(`/session/${id}/update`)
          .set('Authorization', `Bearer ${token}`)
          .send({ startTime: newStartTime })
          .expect(201)

        const { body } = await request(app.getHttpServer())
          .get(`/session/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send()
          .expect(200)

        expect(body.startTime).toBe(newStartTime.toJSON())
      })
    })

    describe("with someone else's token", () => {
      let otherToken: string | undefined = undefined

      beforeEach(async () => {
        const authRes = await authenticate(app)
        otherToken = authRes.token
      })

      it('should fail to update', async () => {
        const newStartTime = new Date()

        await request(app.getHttpServer())
          .post(`/session/${id}/update`)
          .set('Authorization', `Bearer ${otherToken}`)
          .send({ startTime: newStartTime })
          .expect(404)

        const { body } = await request(app.getHttpServer())
          .get(`/session/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send()
          .expect(200)

        expect(body.startTime).toBe(startTime!.toJSON())
      })
    })
  })
})
