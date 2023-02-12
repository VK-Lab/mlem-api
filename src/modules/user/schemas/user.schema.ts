import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { RoleEnum } from '@/common';

@Schema({ timestamps: true, versionKey: false, collection: 'users' })
export class User {
  @Prop({
    trim: true,
  })
  public phoneNumber!: string;

  @Prop({
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  })
  public walletAddress!: string;

  @Prop()
  public chainId!: string;

  @Prop({
    trim: true,
  })
  public country!: string;

  @Prop({
    required: true,
    type: [String],
    enum: RoleEnum,
    default: [RoleEnum.USER],
  })
  public roles!: RoleEnum[];

  @Prop({
    default: false,
  })
  public isVerifyPhone!: boolean;

  public _id!: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;

UserSchema.set('toJSON', {
  virtuals: true,
});
