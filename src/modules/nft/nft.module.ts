import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CasperModule } from '@libs/casper';

import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { Nft, NftSchema } from './schemas';
import { TelegramService } from './telegram.service';

import { ClaimModule } from '@/modules/claim';
import { UserModule } from '@/modules/user';
import { BenefitModule } from '@/modules/benefit';
import { ConfigService } from '@/common';

@Module({
  imports: [
    ClaimModule,
    UserModule,
    BenefitModule,
    MongooseModule.forFeature([{ name: Nft.name, schema: NftSchema }]),
    CasperModule.registerCep78({
      useFactory: (configService: ConfigService) => {
        return {
          nodeUrl: configService.get('casper.nodeUrl'),
          networkName: configService.get('casper.networkName'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [NftController],
  providers: [NftService, TelegramService],
  exports: [NftService],
})
export class NftModule {}
