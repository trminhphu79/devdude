import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Account } from '../shared/models/account';
import {
  RegisterUserDto,
  LoginAdminDto,
  CreateAdminDto,
  UserRole,
} from '@devdue/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
    private jwtService: JwtService
  ) {}

  /**
   * Register a new user (passwordless)
   */
  async registerUser(dto: RegisterUserDto) {
    // Check if email already exists
    const existingAccount = await this.accountModel.findOne({
      where: { email: dto.email },
    });

    if (existingAccount) {
      throw new ConflictException('Email already registered');
    }

    // Create user account (no password)
    const account = await this.accountModel.create({
      email: dto.email,
      fullName: dto.fullName,
      role: UserRole.USER,
      passwordHash: null,
      isActive: true,
    } as any);

    const tokens = await this.generateTokens(account);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      account: {
        id: account.id,
        email: account.email,
        fullName: account.fullName,
        role: account.role,
      },
    };
  }

  /**
   * Admin login with password
   */
  async loginAdmin(dto: LoginAdminDto) {
    const account = await this.accountModel.findOne({
      where: { email: dto.email },
    });

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account has password (is admin)
    if (!account.passwordHash) {
      throw new UnauthorizedException(
        'This account does not have admin access'
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      account.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is active
    if (!account.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const tokens = await this.generateTokens(account);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      account: {
        id: account.id,
        email: account.email,
        fullName: account.fullName,
        role: account.role,
      },
    };
  }

  /**
   * Create admin account (for admin panel)
   */
  async createAdmin(dto: CreateAdminDto) {
    // Check if email already exists
    const existingAccount = await this.accountModel.findOne({
      where: { email: dto.email },
    });

    if (existingAccount) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create admin account
    const account = await this.accountModel.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
      role: dto.role,
      isActive: true,
    } as any);

    return {
      id: account.id,
      email: account.email,
      fullName: account.fullName,
      role: account.role,
      isActive: account.isActive,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(userId: string) {
    const account = await this.accountModel.findByPk(userId);

    if (!account) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!account.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const tokens = await this.generateTokens(account);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Get current account details
   */
  async getCurrentAccount(userId: string) {
    const account = await this.accountModel.findByPk(userId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return {
      id: account.id,
      email: account.email,
      fullName: account.fullName,
      role: account.role,
      isActive: account.isActive,
    };
  }

  /**
   * Generate JWT access and refresh tokens
   */
  private async generateTokens(account: Account) {
    const payload = {
      sub: account.id,
      email: account.email,
      role: account.role,
      fullName: account.fullName,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        'your-refresh-secret-key-change-in-production',
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }
}
