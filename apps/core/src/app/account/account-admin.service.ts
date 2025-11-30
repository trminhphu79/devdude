import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Account } from '../shared/models/account';
import { CreateAdminDto, UpdateAccountDto } from '@devdude/common';
import { Op } from 'sequelize';

@Injectable()
export class AccountAdminService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account
  ) {}

  async createAccount(dto: CreateAdminDto) {
    // Check if email already exists
    const existingAccount = await this.accountModel.findOne({
      where: { email: dto.email },
    });

    if (existingAccount) {
      throw new ConflictException('Email already registered');
    }

    // Hash password if provided
    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : null;

    const account = await this.accountModel.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
      role: dto.role,
      isActive: true,
    } as any);

    return this.sanitizeAccount(account);
  }

  async findAllAccounts(filters?: {
    role?: string;
    isActive?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${filters.search}%` } },
        { fullName: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const accounts = await this.accountModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return accounts.map((account) => this.sanitizeAccount(account));
  }

  async findAccountById(id: string) {
    const account = await this.accountModel.findByPk(id);

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return this.sanitizeAccount(account);
  }

  async updateAccount(id: string, dto: UpdateAccountDto) {
    const account = await this.accountModel.findByPk(id);

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await account.update(dto);

    return this.sanitizeAccount(account);
  }

  async deleteAccount(id: string) {
    const account = await this.accountModel.findByPk(id);

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    // Soft delete by setting isActive to false
    await account.update({ isActive: false });
  }

  async toggleAccountStatus(id: string) {
    const account = await this.accountModel.findByPk(id);

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await account.update({ isActive: !account.isActive });

    return this.sanitizeAccount(account);
  }

  /**
   * Remove sensitive data from account object
   */
  private sanitizeAccount(account: Account) {
    return {
      id: account.id,
      email: account.email,
      fullName: account.fullName,
      role: account.role,
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
