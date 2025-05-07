import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @MinLength(2)
  @IsString()
  name?: string;

  @IsOptional()
  @MinLength(2)
  @IsString()
  brand?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  year?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  price?: number;
}
