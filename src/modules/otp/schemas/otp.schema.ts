import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum OtpTypesEnum {
  USER_VERIFY_PHONE = 'user_verify_phone',
}

@Schema({ versionKey: false, collection: 'otpcodes' })
export class OtpCode {
  @Prop({
    required: true,
    ref: 'User',
    type: MongooseSchema.Types.ObjectId,
  })
  public userId!: string;

  @Prop({
    enum: OtpTypesEnum,
    required: true,
  })
  public type!: OtpTypesEnum;

  @Prop({
    required: true,
  })
  public code!: string;

  @Prop({ default: 0 })
  public timesTried!: number;

  @Prop({ default: Date.now })
  public generatedAt!: Date;
}

export const OtpCodeSchema = SchemaFactory.createForClass(OtpCode);

export type OtpCodeDocument = OtpCode & Document;

OtpCodeSchema.index({ generatedAt: 1 }, { expireAfterSeconds: 60 * 30 });
OtpCodeSchema.index({ userId: 1, type: 1 }, { unique: true });
