import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { verifyMessageSignature, CLPublicKey, decodeBase16 } from 'casper-js-sdk';
import _ from 'lodash';
import parsePhoneNumber from 'libphonenumber-js';

import { LoginUserResultDto, RegisterUserDto, VerifySignatureDto } from '../dtos';
import { Payload } from '../auth.interface';

import { UserService, User, UserIdDto } from '@/modules/user';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
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

    return {
      userId: userId.toString(),
    };
  }

  public async loginOrCreate(verifySignatureDto: VerifySignatureDto): Promise<LoginUserResultDto> {
    const isValid = verifyMessageSignature(
      CLPublicKey.fromHex(verifySignatureDto.address),
      `mlem-${verifySignatureDto.address}`,
      decodeBase16(verifySignatureDto.signature),
    );

    if (!isValid) {
      throw new ForbiddenException('signature_is_not_valid');
    }
    const foundUser = await this.userService.findOrCreateUserByWalletAddress(verifySignatureDto.address);
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

  public signUserAccessToken(user: User): string {
    return this.jwtService.sign({
      userId: user._id,
      walletAddress: user.walletAddress,
      roles: user.roles,
    });
  }
}
