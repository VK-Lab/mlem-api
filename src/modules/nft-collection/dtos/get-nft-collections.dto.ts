import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { PaginationDto } from '@/common';

export class GetNftCollectionsDto extends PaginationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public walletAddress!: string;
}
