import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifySignatureDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public sig!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public walletAddress!: string;
}
