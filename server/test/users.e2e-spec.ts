import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/users/profile (GET)', () => {
    describe('unauthenticated', () => {
      it('should be unauthorized', () => {
        return request(app.getHttpServer())
          .get('/users/profile')
          .expect(401);
      });
    });
    describe('authenticated', () => {
      let token: string | null = null;
      beforeEach(async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: 'john',
            password: 'changeme',
          });
        token = res.body.access_token;
      });
      it('should return user profile', () => {
        return request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect({
            userId: 1,
            username: 'john',
          });
      });
    });
  });
});
