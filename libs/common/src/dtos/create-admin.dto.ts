import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums';

export class CreateAdminDto {
  @ApiProperty({
    example: 'admin@devdude.com',
    description: 'Admin email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Admin password (min 8 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Admin User',
    description: 'Admin full name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    enum: UserRole,
    description: 'User role',
    default: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
