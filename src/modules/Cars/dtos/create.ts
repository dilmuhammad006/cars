import { ICreateCarRequest } from '../interfaces';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
export class Createdto implements ICreateCarRequest {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  brand: string;

  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  @IsOptional()
  year: number;

  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  @IsOptional()
  price: number;
}
