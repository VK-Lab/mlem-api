import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty()
  public userId!: string;

  constructor(init?: Partial<UserIdDto>) {
    Object.assign(this, init);
  }
}
