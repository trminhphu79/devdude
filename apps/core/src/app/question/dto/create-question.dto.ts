import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsInt,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAnswerOptionDto } from './create-answer-option.dto';

export enum QuestionType {
  SINGLE_CHOICE = 'single-choice',
  MULTI_CHOICE = 'multi-choice',
  CODE_TEXT = 'code-text',
}

export enum DifficultyLevel {
  FRESHER = 'Fresher',
  JUNIOR = 'Junior',
  MID = 'Mid',
  MID_LATE = 'MidLate',
  SENIOR = 'Senior',
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @ApiProperty({ enum: DifficultyLevel })
  @IsEnum(DifficultyLevel)
  @IsNotEmpty()
  difficultyLevel: DifficultyLevel;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  weight: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  timeLimitSec: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({ type: [CreateAnswerOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerOptionDto)
  @ArrayMinSize(1)
  options: CreateAnswerOptionDto[];
}
