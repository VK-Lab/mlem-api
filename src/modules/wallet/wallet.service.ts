import { Injectable } from '@nestjs/common';
import { EvmChain, EvmNftCollection } from '@moralisweb3/evm-utils';
import { PaginatedResult } from '@moralisweb3/api-utils';

import { GetWalletNftCollectionsDto } from './dtos';

import { Payload } from '@/auth';
import { MoralisService } from '@/common';

@Injectable()
export class WalletService {
  constructor(
    private readonly moralisService: MoralisService,
  ) {}

  public async getWalletNftCollections(
    user: Payload, getWalletNftCollectionsDto: GetWalletNftCollectionsDto): Promise<PaginatedResult<EvmNftCollection[]>> {
    return this.moralisService.getWalletNftCollections(user.walletAddress, { chain: EvmChain.MUMBAI, ...getWalletNftCollectionsDto });
  }
}
