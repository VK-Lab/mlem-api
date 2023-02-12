import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  public phoneNumber!: string;
}
