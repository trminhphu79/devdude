import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddQuestionToTemplateDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  orderIndex: number;
}
