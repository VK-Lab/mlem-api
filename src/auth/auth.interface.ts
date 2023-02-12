import { Types } from 'mongoose';

import { RoleEnum } from '@/common';

export interface JwtPayload {
  userId: string;
  walletAddress: string;
  chainId: string;
  roles: RoleEnum[];
}

export interface Payload {
  userId: Types.ObjectId;
  walletAddress: string;
  chainId: string;
  roles: RoleEnum[];
}
