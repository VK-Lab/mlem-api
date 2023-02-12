import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './services';
import { AuthSerializer } from './auth.serializer';
import { JwtStrategy } from './strategy';

import { UserModule } from '@/modules/user';
import { ConfigService } from '@/common';
import { OtpModule } from '@/modules/otp';

@Module({
  imports: [
    HttpModule,
    UserModule,
    OtpModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwtSecret'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),

  ],
  providers: [
    AuthService,
    AuthSerializer,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
