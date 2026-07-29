import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  );

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.THROTTLE_TTL) || 60000,
    max: parseInt(process.env.THROTTLE_LIMIT) || 10,
    message: 'Too many requests, please try again later.',
  });
  app.use('/api', limiter);

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Serve static files (if needed)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();