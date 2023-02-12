import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { ClaimStatusEnum } from '@/common';

export class UpdateClaimStatusDto {
  @ApiProperty()
  @IsEnum(ClaimStatusEnum)
  public status!: ClaimStatusEnum;
}
