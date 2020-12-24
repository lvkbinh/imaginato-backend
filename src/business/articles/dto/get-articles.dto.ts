import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetArticlesDTO {
  @ApiPropertyOptional({ default: 0 })
  @Transform(value => Number.parseInt(value))
  @IsOptional()
  @IsNumber()
  skip?: number;

  @ApiPropertyOptional({ default: 20 })
  @Transform(value => Number.parseInt(value))
  @IsOptional()
  @IsNumber()
  take?: number;

  @ApiPropertyOptional({ default: 'createdAt:desc' })
  @IsOptional()
  @IsString()
  sort?: string;
}