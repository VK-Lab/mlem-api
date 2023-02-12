/* eslint-disable @typescript-eslint/object-curly-spacing */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';

import { EsmsSendMessageResponse } from './interfaces';

import { ConfigService, Logger } from '@/common/providers';


@Injectable()
export class OtpEsmsApiService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.logger.setContext(OtpEsmsApiService.name);
  }

  public async sendOtpCode(phone: string, otpCode: string): Promise<EsmsSendMessageResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post<EsmsSendMessageResponse>('SendMultipleMessage_V4_post_json', {
        'ApiKey': this.configService.get('esms.apiKey'),
        'Content': `${otpCode} la ma xac minh dang ky ${this.configService.get('esms.brandName')} cua ban`,
        'Phone': phone,
        'SecretKey': this.configService.get('esms.secretKey'),
        'Brandname': this.configService.get('esms.brandName'),
        'SmsType': this.configService.get('esms.smsType'),
      }).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );

    this.logger.debug(`Data: ${JSON.stringify(data)}`);
    return data;
  }
}
