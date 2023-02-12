import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { EvmNft, EvmNftCollection } from '@moralisweb3/evm-utils';
import { ApiOkResponse } from '@nestjs/swagger';
import { PaginatedResult } from '@moralisweb3/api-utils';

import { NftCollectionService } from './nft-collection.service';
import { GetNftCollectionsDto, GetNftsFromCollectionDto } from './dtos';

import { Auth } from '@/common';

@Controller('nft-collections')
export class NftCollectionController {
  constructor(private readonly nftCollectionService: NftCollectionService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    description: 'Get wallet nft collections',
  })
  public async get(
    @Query() getNftCollectionsDto: GetNftCollectionsDto,
  ): Promise<PaginatedResult<EvmNftCollection[]>> {
    return this.nftCollectionService.getMoralisNftCollections(getNftCollectionsDto);
  }

  @Get(':tokenAddress')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    description: 'Get nft collection',
  })
  public async getCollection(@Param('tokenAddress') tokenAddress: string): Promise<EvmNftCollection> {
    return this.nftCollectionService.getCollection(tokenAddress);
  }

  @Get(':tokenAddress/nfts')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    description: 'Get nft collection',
  })
  public async getNftsFromCollection(
    @Param('tokenAddress') tokenAddress: string,
      @Query() getNftsFromCollectionDto: GetNftsFromCollectionDto,
  ): Promise<PaginatedResult<EvmNft[]>> {
    return this.nftCollectionService.getNftsFromCollection(tokenAddress, getNftsFromCollectionDto);
  }
}
