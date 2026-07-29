import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from '@/notifications/notifications.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockNotificationsService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.findUnique.mockImplementation(({ where }) => {
        if (where.email === 'test@example.com') return Promise.resolve(mockUser);
        return Promise.resolve(null);
      });

      const result = await service.validateUser('test@example.com', 'password123');
      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.validateUser('nonexistent@example.com', 'password')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('register', () => {
    it('should create a new user and return token', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const mockUser = {
        id: 'new-user-id',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(registerDto.email);
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-user' });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should hash password before saving', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockImplementation(({ data }) => {
        expect(data.password).not.toBe(registerDto.password);
        expect(data.password).toBeDefined();
        return Promise.resolve({
          id: 'new-id',
          email: registerDto.email,
          ...data,
          createdAt: new Date(),
        });
      });

      await service.register(registerDto);
    });
  });
});