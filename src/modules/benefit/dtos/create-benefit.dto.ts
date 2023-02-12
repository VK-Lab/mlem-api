import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBenefitDto {
  @ApiProperty()
  @IsString()
  public name!: string;

  @ApiProperty()
  @IsString()
  public description!: string;
}
