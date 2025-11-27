import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerOptionDto {
  @ApiProperty({ description: 'Answer option text' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Whether this option is correct' })
  @IsNotEmpty()
  isCorrect: boolean;
}
