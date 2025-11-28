import { IsOptional, IsInt, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAttemptDto {
  @ApiProperty({ example: '2023-10-27T10:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  finishedAt?: Date;

  @ApiProperty({ example: 85, required: false })
  @IsInt()
  @IsOptional()
  totalScore?: number;

  @ApiProperty({ example: 'Advanced', required: false })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiProperty({ example: 3600, required: false })
  @IsInt()
  @IsOptional()
  durationSec?: number;
}
