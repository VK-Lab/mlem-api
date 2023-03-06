import { Types } from 'mongoose';

import { RoleEnum } from '@/common';

export interface JwtPayload {
  userId: string;
  walletAddress: string;
  roles: RoleEnum[];
}

export interface Payload {
  userId: Types.ObjectId;
  walletAddress: string;
  roles: RoleEnum[];
}
