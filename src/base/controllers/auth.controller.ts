import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

import {
  AuthService,
  JwtAuthGuard,
  LoginUserResultDto,
  Payload,
  RegisterUserDto,
  VerifySignatureDto,
} from '@/auth';
import { ReqUser } from '@/common';
import { RegisterInterceptor } from '@/common/interceptors/register.interceptor';
import { User, UserIdDto } from '@/modules/user';

// const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/**
 * https://docs.nestjs.com/techniques/authentication
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('check')
  @UseGuards(JwtAuthGuard)
  public check(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }

  @Get('check-phone-verfied')
  @UseGuards(JwtAuthGuard)
  public async checkPhoneVerfied(@ReqUser() user: Payload): Promise<{ isPhoneVerfied: boolean }> {
    return this.authService.checkPhoneVerfied(user);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  public getMe(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }

  @Post('login')
  public async login(
    @Body() verifySignatureDto: VerifySignatureDto,
  ): Promise<LoginUserResultDto> {
    return this.authService.loginOrCreate(verifySignatureDto);
  }

  @Post('logout')
  public logout(
    @Req() req: Express.Request,
  ): boolean {
    req.session.destroy((err: any) => {
      console.log(err);
    });

    return true;
  }

  @UseInterceptors(RegisterInterceptor<User>)
  @Post('register')
  @UseGuards(JwtAuthGuard)
  public async register(@Body() registerUserDto: RegisterUserDto, @ReqUser() user: Payload): Promise<UserIdDto> {
    return this.authService.register(user.userId, registerUserDto);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @Get('jwt/check')
  public jwtCheck(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }
}
