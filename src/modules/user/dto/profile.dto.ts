import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';


export class ProfileDto {
  @Expose()
  @ApiProperty()
  public id!: string;

  @Expose()
  @ApiProperty()
  public walletAddress!: string;

  @Expose()
  @ApiProperty()
  public phoneNumber!: string;

  constructor(init?: Partial<ProfileDto>) {
    Object.assign(this, init);
  }
}
