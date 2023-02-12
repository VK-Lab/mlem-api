import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  Req,
  Session,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { generateNonce, SiweMessage } from 'siwe';

import {
  AuthService,
  JwtAuthGuard,
  LoginUserResultDto,
  Payload,
  RegisterUserDto,
  VerifyPhoneNumberByOtpDto,
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

  @Get('nonce')
  public getSessionId(@Session() session: Record<string, string>): { nonce: string } {
    session['nonce'] = generateNonce();
    return {
      nonce: session['nonce'],
    };
  }

  @Post('signature')
  public async verifySignature(
    @Body() verifySignatureDto: VerifySignatureDto, @Session() session: Record<string, string>): Promise<SiweMessage> {
    return this.authService.verifySignature(session['nonce'], verifySignatureDto);
  }

  @Post('login')
  public async login(
    @Body() verifySignatureDto: VerifySignatureDto, @Session() session: Record<string, string>,
  ): Promise<LoginUserResultDto> {
    return this.authService.loginOrCreate(session['nonce'], verifySignatureDto);
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

  @Post('verify-phone-number')
  @UseGuards(JwtAuthGuard)
  public async verifyPhoneNumber(
    @Body() verifyPhoneNumberByOtpDto: VerifyPhoneNumberByOtpDto, @ReqUser() user: Payload): Promise<UserIdDto> {
    return this.authService.verifyPhoneNumber(user.userId, verifyPhoneNumberByOtpDto);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @Get('jwt/check')
  public jwtCheck(@ReqUser() user: Payload): Payload | undefined {
    return user;
  }
}
