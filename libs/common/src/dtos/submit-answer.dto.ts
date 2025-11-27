import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  answerOptionId?: string;

  @ApiProperty({
    example: 'function example() { return true; }',
    required: false,
  })
  @IsString()
  @IsOptional()
  textAnswer?: string;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(0)
  timeTakenSec: number;
}
