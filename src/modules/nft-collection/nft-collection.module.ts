import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NftCollectionService } from './nft-collection.service';
import { NftCollectionController } from './nft-collection.controller';
import { NftCollection, NftCollectionSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NftCollection.name, schema: NftCollectionSchema }]),
  ],
  controllers: [NftCollectionController],
  providers: [NftCollectionService],
  exports: [NftCollectionService],
})
export class NftCollectionModule {}
