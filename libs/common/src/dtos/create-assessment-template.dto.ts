import { IsNotEmpty, IsString, IsUUID, IsInt, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssessmentTemplateDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({ example: 'Angular Fundamentals Assessment' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Comprehensive assessment for Angular basics' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 45 })
  @IsInt()
  @IsNotEmpty()
  totalQuestions: number;

  @ApiProperty({
    example: { Fresher: 12, Junior: 21, Mid: 6, MidLate: 2, Senior: 4 },
  })
  @IsObject()
  @IsNotEmpty()
  difficultyDistribution: {
    Fresher?: number;
    Junior?: number;
    Mid?: number;
    MidLate?: number;
    Senior?: number;
  };
}
