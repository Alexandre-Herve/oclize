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

  describe('get', () => {
    let id: string | undefined = undefined
    let name: string | undefined = undefined
    let startTime: Date | undefined = undefined
    let token: string | undefined = undefined
    let userId: string | undefined = undefined

    beforeEach(async () => {
      const authRes = await authenticate(app)
      token = authRes.token
      userId = authRes.userId

      const res = await createSession(app, token)
      id = res.id
      name = res.name
      startTime = res.startTime
    })

    it('should return a session', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/session/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200)

      expect(body.createdBy).toBe(userId)
      expect(body.id).toBe(id)
      expect(body.invitees.length).toEqual(0)
      expect(body.name).toBe(name)
      expect(body.startTime).toBe(startTime!.toJSON())
    })
  })
})
