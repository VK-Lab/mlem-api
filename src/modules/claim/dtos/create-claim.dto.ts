import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateClaimDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => new Types.ObjectId(value))
  public nftId!: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => new Types.ObjectId(value))
  public benefitId!: Types.ObjectId;
}
