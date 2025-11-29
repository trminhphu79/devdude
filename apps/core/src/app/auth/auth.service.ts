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
import { RegisterUserDto, LoginAdminDto, UserRole } from '@devdue/common';
import { ConfigService } from '../shared/configs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
    private jwtService: JwtService,
    private configService: ConfigService
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
      secret: this.configService.get('app.jwt.secret'),
      expiresIn: this.configService.get('app.jwt.accessTokenExpiry'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('app.jwt.refreshSecret'),
      expiresIn: this.configService.get('app.jwt.refreshTokenExpiry'),
    });

    return { accessToken, refreshToken };
  }
}
