import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { OtpCode, OtpCodeSchema } from './schemas';
import { OtpService } from './otp.service';
import { OtpEsmsApiService } from './otp-esms-api.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
      baseURL: 'http://rest.esms.vn/MainService.svc/json',
    }),
    MongooseModule.forFeature([{ name: OtpCode.name, schema: OtpCodeSchema }]),
  ],
  providers: [OtpService, OtpEsmsApiService],
  exports: [OtpService],
})
export class OtpModule {}
