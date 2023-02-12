import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { Types } from 'mongoose';

import { PaginationDto } from '@/common';

export class GetNftCollectionsDto extends PaginationDto {
  @ApiProperty()
  @IsPositive()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsOptional()
  public override limit: number = 1000;

  @IsOptional()
  @Transform(({ value }: { value: string }) => {

    return new Types.ObjectId(value);
  })
  public campaignId?: Types.ObjectId;
}
