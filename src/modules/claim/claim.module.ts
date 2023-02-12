import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClaimService } from './claim.service';
import { Claim, ClaimSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Claim.name, schema: ClaimSchema }]),
  ],
  providers: [ClaimService],
  exports: [ClaimService],
})
export class ClaimModule {}
