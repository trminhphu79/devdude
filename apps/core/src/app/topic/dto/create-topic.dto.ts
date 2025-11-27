import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({ example: 'Technology', description: 'The name of the topic' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @ApiProperty({
    example: 'All about tech',
    description: 'The description of the topic',
  })
  @IsString()
  @MaxLength(256)
  description: string;

  @ApiProperty({ example: true, description: 'Whether the topic is active' })
  @IsBoolean()
  isActive: boolean;
}
