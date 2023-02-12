import { ApiProperty } from '@nestjs/swagger';

export class UserFileDto {
  @ApiProperty()
  public userId!: string;

  @ApiProperty()
  public url!: string;

  @ApiProperty()
  public key!: string;
}
