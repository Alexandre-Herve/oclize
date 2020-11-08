import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from './../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { CreateSessionDto } from '../src/session/application/api/dtos/create-session.dto'
import { authenticate } from './helpers/auth'
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

      startTime = new Date()
      name = uuid()

      const createSessionDto: CreateSessionDto = {
        name,
        startTime,
      }

      const res = await request(app.getHttpServer())
        .post('/session/create')
        .set('Authorization', `Bearer ${token}`)
        .send(createSessionDto)
        .expect(201)

      id = res.body.id
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

  describe('create', () => {
    describe('authenticated', () => {
      let token: string | undefined = undefined

      beforeEach(async () => {
        const authRes = await authenticate(app)
        token = authRes.token
      })

      describe('whith a valid dto', () => {
        it('should succeed and return a session', async () => {
          const startTime = new Date()
          const name = 'oclize session'
          const createSessionDto: CreateSessionDto = {
            name,
            startTime,
          }
          const { body } = await request(app.getHttpServer())
            .post('/session/create')
            .set('Authorization', `Bearer ${token}`)
            .send(createSessionDto)
            .expect(201)

          expect(body.name).toBe(name)
          expect(body.startTime).toBe(startTime.toJSON())
          expect(body.invitees.length).toBe(0)
          expect(body.id).toBeDefined()
        })
      })
    })
  })
})
