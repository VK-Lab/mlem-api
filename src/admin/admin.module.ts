import { Module } from '@nestjs/common';

import * as controllers from './controllers';
import  * as services from './services';

import { BenefitModule } from '@/modules/benefit';
import { ClaimModule } from '@/modules/claim';
import { NftModule } from '@/modules/nft';
import { NftCollectionModule } from '@/modules/nft-collection';
import { CampaignModule } from '@/modules/campaign';

@Module({
  imports: [
    NftCollectionModule,
    ClaimModule,
    BenefitModule,
    NftModule,
    CampaignModule,
  ],
  controllers: Object.values(controllers),
  providers: Object.values(services),
})
export class AdminModule {}
