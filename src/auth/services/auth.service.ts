import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { SiweMessage } from 'siwe';
import _ from 'lodash';
import parsePhoneNumber from 'libphonenumber-js';

import { LoginUserResultDto, RegisterUserDto, VerifyPhoneNumberByOtpDto, VerifySignatureDto } from '../dtos';
import { Payload } from '../auth.interface';

import { UserService, User, UserIdDto } from '@/modules/user';
import { OtpService, OtpTypesEnum } from '@/modules/otp';
import { ConfigService, RoleEnum } from '@/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private otpService: OtpService,
    private configService: ConfigService,
  ) {}

  public async register(userId: Types.ObjectId, registerUserDto: RegisterUserDto): Promise<UserIdDto> {
    const phoneNumber = `0${parsePhoneNumber(registerUserDto.phoneNumber, 'VI')?.nationalNumber}`;

    const foundUser = await this.userService.findByVerifiedPhone(phoneNumber);
    if (foundUser) {
      throw new BadRequestException('your_phone_does_exists');
    }

    const updated = await this.userService.updatePhoneNumber(new Types.ObjectId(userId), phoneNumber);
    if (updated.modifiedCount <= 0) {
      throw new BadRequestException('user_can_not_register_phone_number');
    }

    await this.otpService.sendSmsNewOtpCode({
      userId: userId.toString(),
      phone: phoneNumber,
      type: OtpTypesEnum.USER_VERIFY_PHONE,
    });

    return {
      userId: userId.toString(),
    };
  }

  public async loginOrCreate(nonce: string, verifySignatureDto: VerifySignatureDto): Promise<LoginUserResultDto> {
    const fields = await this.verifySignature(nonce, verifySignatureDto);

    const foundUser = await this.userService.findOrCreateUserByWalletAddress(fields.address.toLowerCase());
    const token = this.signUserAccessToken(foundUser);

    return {
      accessToken: token,
      isVerifyPhone: foundUser.isVerifyPhone,
      isPhoneExist: !_.isEmpty(foundUser.phoneNumber),
      userId: foundUser._id.toString(),
    };
  }

  public async checkPhoneVerfied(user: Payload): Promise<{ isPhoneVerfied: boolean }> {
    const foundUser = await this.userService.findById(user.userId);

    return {
      isPhoneVerfied: !!foundUser?.isVerifyPhone,
    };
  }

  public async verifySignature(nonce: string, { message, signature }: VerifySignatureDto): Promise<SiweMessage> {
    if (!this.configService.get('isDebugging') && !nonce) {
      throw new BadRequestException('empty_nonce');
    }
    const siweMessage = new SiweMessage(message);
    let fields;
    try {
      fields = await siweMessage.validate(signature);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }

    if (!this.configService.get('isDebugging') && fields?.nonce !== nonce) {
      throw new BadRequestException('invalid_nonce');
    }

    return fields;
  }

  public async verifyAdminSignature(nonce: string, verifySignatureDto: VerifySignatureDto): Promise<User> {
    const fields = await this.verifySignature(nonce, verifySignatureDto);

    const foundUser = await this.userService.findUserWithRole(fields.address.toLowerCase(), RoleEnum.ADMIN);
    if (!foundUser) {
      throw new BadRequestException('user_not_found');
    }

    return foundUser;
  }

  public async verifyPhoneNumber(userId: Types.ObjectId, { otpCode }: VerifyPhoneNumberByOtpDto): Promise<LoginUserResultDto> {
    await this.otpService.verifyOtpCode({
      userId: userId.toString(),
      code: otpCode,
      type: OtpTypesEnum.USER_VERIFY_PHONE,
    });

    const foundUser = await this.userService.findById(userId);
    if (!foundUser) {
      throw new BadRequestException('user_not_found');
    }

    const updated = await this.userService.markPhoneVerified(userId, true);
    if (updated.modifiedCount <= 0) {
      throw new BadRequestException('user_can_not_update');
    }

    const token = this.signUserAccessToken(foundUser);

    return {
      accessToken: token,
      userId: userId.toString(),
    };
  }

  public signUserAccessToken(user: User): string {
    return this.jwtService.sign({
      userId: user._id,
      walletAddress: user.walletAddress,
      chainId: user.chainId,
      roles: user.roles,
    });
  }
}
