import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from './../../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { CreateSessionDto } from '../../src/session/application/api/dtos/create-session.dto'
import { authenticate } from '../helpers/auth'
import { createSession } from './helpers/create'
import * as request from 'supertest'

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
          startTime.setDate(startTime.getDate() + 1)

          const name = 'oclize session'
          const createSessionDto: CreateSessionDto = {
            name,
            startTime,
          }

          const res = await createSession(app, token!, createSessionDto)

          expect(res.name).toBe(name)
          expect(res.startTime).toBe(startTime.toJSON())
          expect(res.invitees.length).toBe(0)
          expect(res.id).toBeDefined()
        })
      })
      describe('whith a invalid dto', () => {
        it('should succeed and return a session', async () => {
          const startTime = new Date()
          startTime.setDate(startTime.getDate() - 1)

          const name = 'oclize session'
          const createSessionDto: CreateSessionDto = {
            name,
            startTime,
          }

          await request(app.getHttpServer())
            .post('/session/create')
            .set('Authorization', `Bearer ${token}`)
            .send(createSessionDto)
            .expect(400)
        })
      })
    })
  })
})
