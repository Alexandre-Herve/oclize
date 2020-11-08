import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from './../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { CreateSessionDto } from '../src/session/adapters/api/dtos/create-session.dto'
import { authenticate } from './helpers/auth'

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
          const name = 'oclize session'
          const createSessionDto: CreateSessionDto = {
            name,
            startTime,
          }
          await request(app.getHttpServer())
            .post('/session/create')
            .set('Authorization', `Bearer ${token}`)
            .send(createSessionDto)
            .expect(201)
            .expect((res) => {
              const body = res.body
              return (
                body.name === name &&
                body.startTime === startTime.toJSON() &&
                body.id
              )
            })
        })
      })
    })
  })
})
