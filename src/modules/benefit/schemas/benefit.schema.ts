import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'benefits' })
export class Benefit {
  @Prop({
    required: true,
  })
  public name!: string;

  @Prop()
  public description!: string;

  @Prop({
    required: true,
  })
  public createdBy!: Types.ObjectId;

  public _id!: Types.ObjectId;
}

export const BenefitSchema = SchemaFactory.createForClass(Benefit);

export type BenefitDocument = Benefit & Document;

BenefitSchema.set('toJSON', {
  virtuals: true,
});
