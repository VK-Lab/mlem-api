import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { NftService } from './nft.service';
import { GetNftsDto } from './dtos';
import { Erc721Metadata, NftId } from './interfaces';
import { Nft } from './schemas';
import { NftDetailDto } from './dtos/nft-detail.dto';

import { Auth, ParseObjectId, ReqUser } from '@/common';
import { Payload } from '@/auth';

@ApiTags('nfts')
@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    description: 'Get nfts',
  })
  public async getNfts(@ReqUser() user: Payload, @Query() getNftsDto: GetNftsDto): Promise<NftDetailDto[]> {
    return this.nftService.getNfts(user, getNftsDto);
  }

  @Post(':nftId/benefits/:benefitId/claim')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    description: 'Claim benefit',
  })
  public async claimBenefit(
    @ReqUser() user: Payload,
      @Param('nftId', ParseObjectId) nftId: Types.ObjectId,
      @Param('benefitId', ParseObjectId) benefitId: Types.ObjectId,
  ): Promise<NftId> {
    return this.nftService.cliamBenefit(user, nftId, benefitId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get nft metadata by Id',
  })
  public async getNftMetadataById(@Param('id', ParseObjectId) id: Types.ObjectId): Promise<Erc721Metadata> {
    return this.nftService.getNftMetadataById(id);
  }

  @Get(':tokenAddress/:tokenId')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    description: 'Get nft',
  })
  public async getNft(
    @ReqUser() user: Payload,
      @Param('tokenAddress') tokenAddress: string,
      @Param('tokenId') tokenId: string,
  ): Promise<Nft> {
    return this.nftService.getNft(user, { tokenAddress, tokenId });
  }

  @Get(':tokenAddress/:tokenId/metadata')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get nft metadata',
  })
  public async getNftMetadata(@Param('tokenAddress') tokenAddress: string, @Param('tokenId') tokenId: string): Promise<Erc721Metadata> {
    return this.nftService.getNftMetadata(tokenAddress, tokenId);
  }
}
