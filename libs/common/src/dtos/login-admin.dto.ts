import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums';

export class LoginAdminDto {
  @ApiProperty({
    example: 'admin@devdude.com',
    description: 'Admin email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Admin password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
