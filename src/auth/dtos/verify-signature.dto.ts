import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SiweMessage } from 'siwe';

export class VerifySignatureDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public signature!: string;

  @ApiProperty()
  @IsNotEmpty()
  public message!: SiweMessage;
}
