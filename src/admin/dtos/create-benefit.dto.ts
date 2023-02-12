import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBenefitDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string;
}
