import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { BatchCreateNftsDto, GetNftsDto, UpdateNftDto } from '../dtos';
import { CreateNftDto } from '../dtos/create-nft.dto';

import { IdDto } from '@/common/dtos/id.dto';
import { ListDto } from '@/common';
import { Nft, NftService } from '@/modules/nft';

@Injectable()
export class AdminNftService {
  constructor(
    private readonly nftService: NftService) {
  }

  public async getNfts(getNftsDto: GetNftsDto): Promise<ListDto<Nft>> {
    return this.nftService.getPaginatedNfts(getNftsDto);
  }

  public async updateNft(id: Types.ObjectId, updateNftDto: UpdateNftDto): Promise<IdDto> {
    const result = await this.nftService.updateNftById(id, updateNftDto);

    if (result.modifiedCount === 0) {
      throw new BadRequestException('can_not_update_nft');
    }

    return {
      id: id.toString(),
    };
  }

  public async createNft(createNftDto: CreateNftDto): Promise<IdDto> {
    const foundNft = await this.nftService.findByTokenAddressAndTokenId(createNftDto.tokenAddress, createNftDto.tokenId);
    if (foundNft) {
      throw new BadRequestException('nft_does_exist');
    }
    const createdNft = await this.nftService.createNft(createNftDto);

    return {
      id: createdNft._id.toString(),
    };
  }

  public async batchCreateNftsDto({ nfts }: BatchCreateNftsDto): Promise<IdDto[]> {
    const createdNfts = await this.nftService.insertMany(nfts);

    return createdNfts.map((nft: Nft) => ({
      id: nft._id.toString(),
    }));
  }
}
