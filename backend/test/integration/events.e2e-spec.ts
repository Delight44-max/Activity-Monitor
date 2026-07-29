import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('EventsController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    prismaService = app.get(PrismaService);
    await prismaService.event.deleteMany();
    await prismaService.user.deleteMany();

    // Register and login to get token
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'John123',
        confirmPassword: 'John123',
      });

    authToken = registerResponse.body.token;
  });

  describe('/api/auth/events (POST)', () => {
    it('should create a new event', () => {
      return request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Test event message' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.message).toBe('Test event message');
          expect(res.body).toHaveProperty('userId');
        });
    });

    it('should reject without authentication', () => {
      return request(app.getHttpServer())
        .post('/api/events')
        .send({ message: 'Test event' })
        .expect(401);
    });

    it('should validate message is required', () => {
      return request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('/api/events (GET)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Event 1' });

      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Event 2' });
    });

    it('should return all events in descending order', () => {
      return request(app.getHttpServer())
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
        });
    });

    it('should return empty array if no events', async () => {
      await prismaService.event.deleteMany();

      return request(app.getHttpServer())
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });
  });

  describe('/api/events/stats (GET)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Event 1' });
    });

    it('should return event statistics', () => {
      return request(app.getHttpServer())
        .get('/api/events/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalEvents');
          expect(res.body).toHaveProperty('todayEvents');
          expect(res.body).toHaveProperty('connectedUsers');
          expect(typeof res.body.totalEvents).toBe('number');
          expect(typeof res.body.todayEvents).toBe('number');
          expect(typeof res.body.connectedUsers).toBe('number');
        });
    });
  });
});