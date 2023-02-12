import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import {
  ProfileDto,
} from './dto';

import { Payload } from '@/auth';
import { ReqUser } from '@/common';
import { Auth } from '@/common/decorators/http.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/profile')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    description: 'Get my profile',
    type: ProfileDto,
  })
  public async getMyProfile(@ReqUser() user: Payload): Promise<ProfileDto> {
    return this.userService.getProfile(user.userId);
  }
}
