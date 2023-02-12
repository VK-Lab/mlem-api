import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { isArray, IsArray, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';


export class UpdateNftDto {
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
  @Transform(({ value }: { value: string[] }) => {
    if (!isArray(value)) {
      return [];
    }

    return value.map((val: string) => new Types.ObjectId(val));
  })
  public benefits!: Types.ObjectId[];
}
