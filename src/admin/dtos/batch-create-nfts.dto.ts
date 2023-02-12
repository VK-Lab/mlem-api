import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';

import { CreateNftDto } from './create-nft.dto';

export class BatchCreateNftsDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(1000)
  @Type(() => CreateNftDto)
  public nfts!: CreateNftDto[];
}
