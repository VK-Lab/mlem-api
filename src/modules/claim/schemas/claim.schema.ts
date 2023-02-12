import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ClaimStatusEnum } from '@/common';
import { Benefit } from '@/modules/benefit';

@Schema({ timestamps: true, versionKey: false, collection: 'claims' })
export class Claim {
  @Prop({
    required: true,
  })
  public nftId!: Types.ObjectId;

  @Prop({
    required: true,
  })
  public benefitId!: Types.ObjectId;

  @Prop()
  public campaignId?: Types.ObjectId;

  @Prop({
    ref: 'User',
  })
  public createdBy!: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ClaimStatusEnum,
    default: ClaimStatusEnum.PENDING,
  })
  public status!: ClaimStatusEnum;

  public _id!: Types.ObjectId;

  public benefit?: Benefit;

  public claim?: Claim;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);

export type ClaimDocument = Claim & Document;

ClaimSchema.set('toJSON', {
  virtuals: true,
});

ClaimSchema.index({
  nftId: 1,
  benefitId: 1,
}, {
  unique: true,
});

ClaimSchema.virtual('benefit', {
  ref: 'Benefit',
  localField: 'benefitId',
  foreignField: '_id',
  justOne: true,
});

ClaimSchema.virtual('nft', {
  ref: 'Nft',
  localField: 'nftId',
  foreignField: '_id',
  justOne: true,
});


