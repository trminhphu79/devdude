import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
  Index,
} from 'sequelize-typescript';
import { Attempt } from './attempt';
import { UserRole } from '@devdue/common';

@Table({
  tableName: 'accounts',
  timestamps: true,
  underscored: true,
})
export class Account extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Index
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Password hash - only for admin users',
  })
  passwordHash: string;

  @Column({
    type: DataType.ENUM(UserRole.ADMIN, UserRole.USER),
    defaultValue: UserRole.USER,
    allowNull: false,
  })
  role: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;

  @HasMany(() => Attempt)
  attempts: Attempt[];
}
