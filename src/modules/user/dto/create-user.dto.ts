import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';


export class CreateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  public phoneNumber!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public walletAddress!: string;

  constructor(init?: Partial<CreateUserDto>) {
    Object.assign(this, init);
  }
}
