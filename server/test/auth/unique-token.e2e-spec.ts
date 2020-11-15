import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { register, getUniqueToken } from '../helpers/auth'

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

  describe('requestUniqueToken', () => {
    let email: string | undefined = undefined

    beforeEach(async () => {
      const registerRes = await register(app)
      email = registerRes.email
    })

    it('should email a valid token', async () => {
      const uniqueToken = await getUniqueToken(app, email!)
      const authenticationRes = await request(app.getHttpServer())
        .post('/auth/tokenlogin')
        .send({ token: uniqueToken })
        .expect(200)
      expect(authenticationRes.body.access_token).toBeDefined()
    })
  })
})
