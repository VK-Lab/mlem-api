import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';

import { OrderByEnum, SortByEnum } from '../enums';

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public cursor?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @ApiPropertyOptional({
    minimum: 0,
    default: 1,
  })
  public page: number = 1;

  @ApiProperty()
  @IsPositive()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsOptional()
  public limit: number = 100;

  @IsOptional()
  @IsEnum(SortByEnum)
  @ApiPropertyOptional({
    enum: SortByEnum,
    default: SortByEnum.CREATED_AT,
  })
  public sortBy: SortByEnum = SortByEnum.CREATED_AT;

  @IsOptional()
  @IsEnum(OrderByEnum)
  @ApiPropertyOptional({
    enum: OrderByEnum,
    default: OrderByEnum.ASC,
  })
  public orderBy: OrderByEnum = OrderByEnum.DESC;

  constructor(init?: Partial<PaginationDto>) {
    Object.assign(this, init);
  }
}
