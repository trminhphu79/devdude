import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Account } from '../shared/models/account';
import { RegisterUserDto, LoginAdminDto, UserRole } from '@devdue/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mockAccountModel: any;

  const mockAccount = {
    id: '123',
    email: 'test@example.com',
    fullName: 'Test User',
    role: UserRole.USER,
    isActive: true,
    passwordHash: '$2b$10$hashedpassword',
  };

  beforeEach(async () => {
    mockAccountModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Account),
          useValue: mockAccountModel,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    const registerDto: RegisterUserDto = {
      email: 'new@example.com',
      fullName: 'New User',
    };

    it('should register a new user successfully', async () => {
      mockAccountModel.findOne.mockResolvedValue(null);
      mockAccountModel.create.mockResolvedValue({
        ...mockAccount,
        email: registerDto.email,
        fullName: registerDto.fullName,
        role: UserRole.USER,
        passwordHash: null,
      });

      const result = await service.registerUser(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.account.email).toBe(registerDto.email);
      expect(mockAccountModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          role: UserRole.USER,
          passwordHash: null,
        })
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      mockAccountModel.findOne.mockResolvedValue(mockAccount);

      await expect(service.registerUser(registerDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('loginAdmin', () => {
    const loginDto: LoginAdminDto = {
      email: 'admin@example.com',
      password: 'password123',
    };

    it('should login admin successfully', async () => {
      // Mock bcrypt compare
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      mockAccountModel.findOne.mockResolvedValue({
        ...mockAccount,
        role: UserRole.ADMIN,
        passwordHash: 'hashed-password',
      });

      const result = await service.loginAdmin(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.account.role).toBe(UserRole.ADMIN);
    });

    it('should throw UnauthorizedException if account not found', async () => {
      mockAccountModel.findOne.mockResolvedValue(null);

      await expect(service.loginAdmin(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      mockAccountModel.findOne.mockResolvedValue({
        ...mockAccount,
        role: UserRole.ADMIN,
        passwordHash: 'hashed-password',
      });

      await expect(service.loginAdmin(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if account is not admin (no password)', async () => {
      mockAccountModel.findOne.mockResolvedValue({
        ...mockAccount,
        role: UserRole.USER,
        passwordHash: null,
      });

      await expect(service.loginAdmin(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      mockAccountModel.findByPk.mockResolvedValue(mockAccount);

      const result = await service.refreshTokens('123');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException if account not found', async () => {
      mockAccountModel.findByPk.mockResolvedValue(null);

      await expect(service.refreshTokens('123')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if account is inactive', async () => {
      mockAccountModel.findByPk.mockResolvedValue({
        ...mockAccount,
        isActive: false,
      });

      await expect(service.refreshTokens('123')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
