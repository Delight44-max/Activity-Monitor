import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseConfig, FirebaseService } from '../config/firebase.config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY || '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FirebaseConfig, FirebaseService],
  exports: [AuthService],
})
export class AuthModule {}