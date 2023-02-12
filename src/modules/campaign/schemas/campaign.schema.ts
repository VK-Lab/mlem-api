import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { NftCollection } from '@/modules/nft-collection';

@Schema({ timestamps: true, versionKey: false, collection: 'campaigns' })
export class Campaign {
  @Prop({
    trim: true,
  })
  public name!: string;

  @Prop({
    trim: true,
  })
  public description!: string;

  @Prop()
  public tokenHash!: string;

  @Prop({
    type: [Types.ObjectId],
    default: [],
    ref: 'NftCollection',
  })
  public nftCollectionIds!: Types.ObjectId[];

  @Prop()
  public createdBy!: Types.ObjectId;

  public _id!: Types.ObjectId;

  public nftCollections?: NftCollection[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

export type CampaignDocument = Campaign & Document;

CampaignSchema.set('toJSON', {
  virtuals: true,
});

CampaignSchema.virtual('nftCollections', {
  ref: 'NftCollection',
  localField: 'nftCollectionIds',
  foreignField: '_id',
});
