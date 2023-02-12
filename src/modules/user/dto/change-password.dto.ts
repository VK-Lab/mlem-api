import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  public oldPassword!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  public newPassword!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  public newPasswordToConfirm!: string;

  constructor(init?: Partial<ChangePasswordDto>) {
    Object.assign(this, init);
  }
}
