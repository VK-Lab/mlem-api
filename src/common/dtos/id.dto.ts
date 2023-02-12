import { ApiProperty } from '@nestjs/swagger';

export class IdDto {
  @ApiProperty()
  public id!: string;
}
