import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { Nft, NftSchema } from './schemas';
import { TelegramService } from './telegram.service';

import { ClaimModule } from '@/modules/claim';
import { UserModule } from '@/modules/user';
import { BenefitModule } from '@/modules/benefit';

@Module({
  imports: [
    ClaimModule,
    UserModule,
    BenefitModule,
    MongooseModule.forFeature([{ name: Nft.name, schema: NftSchema }]),
  ],
  controllers: [NftController],
  providers: [NftService, TelegramService],
  exports: [NftService],
})
export class NftModule {}
