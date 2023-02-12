
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import * as controllers from './controllers';

import { AuthModule } from '@/auth';
import { AdminModule } from '@/admin';

@Module({
  imports: [
    AuthModule,
    TerminusModule,
    HttpModule,
    AdminModule,
  ], // Authentication
  controllers: Object.values(controllers),
})
export class BaseModule {}
