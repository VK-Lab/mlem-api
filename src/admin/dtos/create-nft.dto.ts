import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { isArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNftDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public tokenAddress!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public tokenId!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public imageUrl!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }: { value: string[] }) => {
    if (!isArray(value)) {
      return [];
    }

    return value.map((val: string) => new Types.ObjectId(val));
  })
  public benefits?: Types.ObjectId[];
}
