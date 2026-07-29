import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

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
    // Clean up test data
    await prismaService.event.deleteMany();
    await prismaService.user.deleteMany();
  });

  describe('/api/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'John123',
          confirmPassword: 'John123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
          expect(res.body.user.email).toBe('john@example.com');
        });
    });

    it('should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'John123',
          confirmPassword: 'John123',
        })
        .expect(201)
        .then(() => {
          return request(app.getHttpServer())
            .post('/api/auth/register')
            .send({
              firstName: 'Jane',
              lastName: 'Doe',
              email: 'john@example.com',
              password: 'Jane123',
              confirmPassword: 'Jane123',
            })
            .expect(409);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'john@example.com',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('firstName should not be empty');
        });
    });
  });

  describe('/api/auth/login (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'John123',
          confirmPassword: 'John123',
        });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'John123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('/api/auth/profile (GET)', () => {
    let token: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'John123',
          confirmPassword: 'John123',
        });
      token = response.body.token;
    });

    it('should get profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe('john@example.com');
        });
    });

    it('should reject without token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });
  });
});