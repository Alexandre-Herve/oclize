import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from './../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { CreateSessionDto } from '../src/session/adapters/api/dtos/create-session.dto'
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

  describe('create', () => {
    describe('authenticated', () => {
      const email = `test-${uuid()}@jeanmichel.com`
      const password = 'password'
      let token: string | undefined = undefined

      beforeEach(async () => {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send({ email, password })
          .expect(201)

        const authenticationRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password })
          .expect(201)

        token = authenticationRes.body.access_token
      })

      describe('whith a valid dto', () => {
        it('should succeed and return a string', () => {
          const startTime = new Date()
          const createSessionDto: CreateSessionDto = {
            name: 'session name',
            startTime,
          }
          return request(app.getHttpServer())
            .post('/session/create')
            .set('Authorization', `Bearer ${token}`)
            .send(createSessionDto)
            .expect(201)
        })
      })
    })
  })
})
