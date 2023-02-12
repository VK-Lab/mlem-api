import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Benefit } from '@/modules/benefit';
import { Claim } from '@/modules/claim';

@Schema({ timestamps: true, versionKey: false, collection: 'nfts' })
export class Nft {
  @Prop({
    trim: true,
  })
  public name!: string;

  @Prop({
    trim: true,
    default: '',
  })
  public description!: string;

  @Prop({
    lowercase: true,
    required: true,
  })
  public tokenAddress!: string;

  @Prop({
    required: true,
  })
  public tokenId!: string;

  @Prop()
  public imageUrl!: string;

  @Prop()
  public tokenHash!: string;

  @Prop({
    type: [Types.ObjectId],
    default: [],
    ref: 'Benefit',
  })
  public benefits?: Types.ObjectId[] | Benefit[];

  @Prop({
    type: [Types.ObjectId],
    default: [],
    ref: 'Claim',
  })
  public claims?: Types.ObjectId[] | Claim[];

  public _id!: Types.ObjectId;
}

export const NftSchema = SchemaFactory.createForClass(Nft);

export type NftDocument = Nft & Document;

NftSchema.set('toJSON', {
  virtuals: true,
});

NftSchema.index({
  tokenAddress: 1,
  tokenId: 1,
});

NftSchema.virtual('nftCollection', {
  ref: 'NftCollection',
  localField: 'tokenAddress',
  foreignField: 'tokenAddress',
  justOne: true,
});
