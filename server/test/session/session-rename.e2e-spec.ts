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

  describe('rename', () => {
    let id: string | undefined = undefined
    let token: string | undefined = undefined

    beforeEach(async () => {
      const authRes = await authenticate(app)
      token = authRes.token

      const res = await createSession(app, token)
      id = res.id
    })

    describe('with a valid name', () => {
      it('should rename a session', async () => {
        const newName = `newName-${uuid}`

        await request(app.getHttpServer())
          .post(`/session/${id}/rename`)
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
  })
})
