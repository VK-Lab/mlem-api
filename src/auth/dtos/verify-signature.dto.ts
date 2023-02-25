import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifySignatureDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public signature!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public address!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  public message!: string;
}
