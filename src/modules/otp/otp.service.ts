/* eslint-disable @typescript-eslint/object-curly-spacing */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model } from 'mongoose';
import { generate } from 'otp-generator';
import { ConfigService } from '@nestjs/config';

import { OtpCodeDocument, OtpCode, OtpTypesEnum } from './schemas';
import { OtpEsmsApiService } from './otp-esms-api.service';

import { Logger } from '@/common/providers';

const LIMIT_LIVE_MINUTES = 30;

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OtpCode.name)
    private readonly otpModel: Model<OtpCodeDocument>,
    private readonly logger: Logger,
    private readonly otpEsmsApiService: OtpEsmsApiService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(OtpService.name);
  }

  public async findByType(userId: string, type: string): Promise<OtpCode | null> {
    return this.otpModel.findOne({ userId, type });
  }

  public async sendSmsNewOtpCode({ userId, phone, type }: { userId: string; phone: string; type: OtpTypesEnum }): Promise<boolean> {
    const otpCode = await this.generateNewOtpCode(userId, type);
    if (this.configService.get('isDebuggingOtp')) {
      this.logger.log(`Sent new OTP code to User(${userId}) successfully with OTP Code: (${otpCode})`);

      return true;
    }
    const result = await this.otpEsmsApiService.sendOtpCode(phone, otpCode);

    this.logger.log(`Sent new OTP code to User(${userId}) successfully with SMSID(${result.SMSID})`);

    return true;
  }

  public async generateNewOtpCode(
    userId: string,
    type: OtpTypesEnum,
    optional: { codeLength: number } = { codeLength: 6 },
  ): Promise<string> {
    const { codeLength = 10 } = optional;
    const newCode = generate(codeLength, { specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false, digits: true });

    const foundOtpCode = await this.otpModel.findOne({ userId, type });
    if (!foundOtpCode) {
      await this.otpModel.create({
        userId,
        type,
        code: newCode,
      });

      this.logger.log('Generated new otp code for user: ', userId);

      return newCode;
    }

    await foundOtpCode.updateOne({
      $set: {
        code: newCode,
        userId,
        type,
        generatedAt: Date.now(),
      },
    });
    this.logger.log('Updated old otp code for user: ', userId);

    return newCode;
  }

  public async verifyOtpCode({
    userId,
    code,
    type,
    limitMinutes = LIMIT_LIVE_MINUTES,
  }: {
    type: OtpTypesEnum | null;
    limitMinutes?: number;
    userId: string;
    code: string;
  }): Promise<void> {
    const foundOtpCode = await this.otpModel.findOne({ userId, type, code });
    if (!foundOtpCode) {
      throw new BadRequestException('otp_not_found', 'OTP not found');
    }

    const momentGeneratedAt = moment(`${foundOtpCode.generatedAt}`);
    const momentNow = moment();
    if (momentNow.diff(momentGeneratedAt, 'minutes') > limitMinutes) {
      throw new BadRequestException('otp_expired', 'OTP time expired');
    }
  }
}
