import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateArticleDTO {
  @ApiProperty()
  @Transform((text: string) => text?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @ApiProperty()
  @Transform((text: string) => text?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  nickname: string;

  @ApiProperty()
  @Transform((text: string) => text?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}