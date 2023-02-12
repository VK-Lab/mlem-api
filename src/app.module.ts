import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { BenefitModule } from './modules/benefit/benefit.module';
import { ClaimModule } from './modules/claim/claim.module';

import { NftCollectionModule } from '@/modules/nft-collection';
import { BaseModule } from '@/base';
import { CommonModule, LoggerMiddleware } from '@/common';
import { configuration } from '@/config';
import { WalletModule } from '@/modules/wallet';
import { NftModule } from '@/modules/nft';
import { UserModule } from '@/modules/user';
import { CampaignModule } from '@/modules/campaign';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const username = configService.get('mongodb.user');
        const password = configService.get('mongodb.password');
        const host = configService.get('mongodb.host');
        const port = configService.get('mongodb.port');
        const database = configService.get('mongodb.database');
        let uri = `mongodb+srv://${username}:${password}@${host}`;
        if (port) {
          uri = `mongodb://${username}:${password}@${host}:${port}`;
        }

        console.log(uri);
        return {
          uri: uri,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    // Base & Common.
    CommonModule,
    BaseModule,

    // Feature modules.
    UserModule,
    WalletModule,
    NftModule,
    NftCollectionModule,
    BenefitModule,
    ClaimModule,
    CampaignModule,
  ],
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
