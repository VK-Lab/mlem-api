import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPhoneNumberByOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public otpCode!: string;
}
