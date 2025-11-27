import { IsNotEmpty, IsUUID, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTemplateQuestionsDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Topic ID to filter questions',
  })
  @IsUUID()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({
    example: [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ],
    description: 'Array of category IDs to filter questions',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
