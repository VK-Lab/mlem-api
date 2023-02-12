import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { isArray, IsArray, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';


export class UpdateNftCollectionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public name!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public description!: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @Transform(({ value }: { value: string[] }) => {
    if (!isArray(value)) {
      return [];
    }

    return value.map((val: string) => new Types.ObjectId(val));
  })
  public benefits?: Types.ObjectId[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }: { value: string[] }) => {
    if (!isArray(value)) {
      return [];
    }

    return value.map((val: string) => new Types.ObjectId(val));
  })
  public benefitIds?: Types.ObjectId[];
}
