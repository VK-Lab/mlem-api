import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResult } from '@moralisweb3/api-utils';
import { EvmNftCollection } from '@moralisweb3/evm-utils';

import { WalletService } from './wallet.service';
import { GetWalletNftCollectionsDto } from './dtos';

import { Auth, ReqUser } from '@/common';
import { Payload } from '@/auth';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/me/nft-collections')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    description: 'Get wallet nft collections',
  })
  public async getWalletNftCollections(
    @Query() getWalletNftCollectionsDto: GetWalletNftCollectionsDto,
      @ReqUser() user: Payload,
  ): Promise<PaginatedResult<EvmNftCollection[]>> {
    return this.walletService.getWalletNftCollections(user, getWalletNftCollectionsDto);
  }
}
