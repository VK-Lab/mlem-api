import { BadRequestException, Injectable } from '@nestjs/common';
import { EvmChain, EvmNft, EvmNftCollection } from '@moralisweb3/evm-utils';
import _ from 'lodash';
import { PaginatedResult } from '@moralisweb3/api-utils';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateWriteOpResult } from 'mongoose';

import { GetNftCollectionsDto, GetNftsFromCollectionDto } from './dtos';
import { NftCollection, NftCollectionDocument } from './schemas';

import { ListDto, MoralisService, PaginationDto } from '@/common';

@Injectable()
export class NftCollectionService {
  constructor(
    private readonly moralisService: MoralisService,
    @InjectModel(NftCollection.name) private nftCollectionModel: Model<NftCollectionDocument>,
  ) {}

  public async getCollection(address: string): Promise<EvmNftCollection> {
    const collection = await this.moralisService.getNftCollectionMetadata(address, { chain: EvmChain.MUMBAI });
    if (_.isEmpty(collection)) {
      throw new BadRequestException('collection_not_found');
    }

    return collection;
  }

  public async getNftCollections({ page, limit }: PaginationDto): Promise<ListDto<NftCollection>> {
    const nftCollections = await this.nftCollectionModel
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit);

    return {
      items: nftCollections,
      total: await this.nftCollectionModel.countDocuments(),
    };
  }

  public async findNftCollections({
    page,
    limit,
    sortBy,
    orderBy,
    ...condition
  }: PaginationDto & FilterQuery<NftCollection>): Promise<ListDto<NftCollection>> {
    const nftCollections = await this.nftCollectionModel
      .find(condition)
      .sort({
        [sortBy]: orderBy,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    return {
      items: nftCollections,
      total: await this.nftCollectionModel.countDocuments(condition),
    };
  }

  public async createNftCollection(nftCollection: Partial<NftCollection>): Promise<NftCollection> {
    return this.nftCollectionModel.create(nftCollection);
  }

  public async updateNftCollection(id: Types.ObjectId, nftCollection: Partial<NftCollection>): Promise<UpdateWriteOpResult> {
    return this.nftCollectionModel.updateOne({ _id: id }, nftCollection);
  }

  public async updateCampaignIds(ids: Types.ObjectId[], campaignId: Types.ObjectId): Promise<UpdateWriteOpResult> {
    return this.nftCollectionModel.updateMany(
      {
        _id: { $in: ids },
        campaignId: {
          $exists: false,
        },
      },
      {
        campaignId,
      },
    );
  }

  public async unsetCampaignIds(ids: Types.ObjectId[]): Promise<UpdateWriteOpResult> {
    return this.nftCollectionModel.updateMany(
      {
        _id: { $in: ids },
        campaignId: {
          $exists: true,
        },
      },
      {
        $unset: {
          campaignId: 1,
        },
      },
    );
  }

  public async getNftsFromCollection(
    address: string,
    getNftsFromCollectionDto: GetNftsFromCollectionDto,
  ): Promise<PaginatedResult<EvmNft[]>> {
    const collection = await this.moralisService.getNftsFromCollection(address, { chain: EvmChain.MUMBAI, ...getNftsFromCollectionDto });
    if (_.isEmpty(collection)) {
      throw new BadRequestException('collection_not_found');
    }

    return collection;
  }

  public async createOrUpdateCollection(address: string): Promise<boolean> {
    const collection = await this.moralisService.getNftCollectionMetadata(address, { chain: EvmChain.MUMBAI });
    if (_.isEmpty(collection)) {
      throw new BadRequestException('collection_not_found');
    }

    const createdCollection = await this.nftCollectionModel.findOneAndUpdate(
      {
        tokenAddress: collection.tokenAddress,
      },
      {
        name: collection.name,
        tokenAddress: collection.tokenAddress,
        contractType: collection.contractType,
        chainId: parseInt(<string>(<unknown>collection.chain), 16),
      },
      {
        upsert: true,
      },
    );

    if (!createdCollection) {
      throw new BadRequestException('nft_collection_not_modify');
    }
    // const evmNfts = await this.moralisService.getAllNftsFromCollection(address, { chain: EvmChain.MUMBAI });
    // if (_.isEmpty(evmNfts)) {
    //   throw new BadRequestException('nfts_are_empty');
    // }
    // const nfts: Nft[] = evmNfts.map((evmNft: EvmNftData) => {
    //   const massagedEvmNft = this.moralisService.massageNft(evmNft);
    //   return <Nft>_.omitBy(
    //     {
    //       name: _.get(massagedEvmNft, 'metadata.name', ''),
    //       description: _.get(massagedEvmNft, 'metadata.description'),
    //       imageUrl: _.get(massagedEvmNft, 'metadata.image'),
    //       tokenHash: massagedEvmNft.tokenHash,
    //       tokenId: massagedEvmNft.tokenId,
    //       tokenAddress: <string>(<unknown>massagedEvmNft.tokenAddress),
    //       collectionId: createdCollection!._id,
    //     },
    //     (value: Nft) => _.isEmpty(value),
    //   );
    // });

    // await this.nftService.upsertMany(nfts);

    return true;
  }

  public async getMoralisNftCollections({ walletAddress, ...options }: GetNftCollectionsDto): Promise<PaginatedResult<EvmNftCollection[]>> {
    return this.moralisService.getWalletNftCollections(walletAddress, { chain: EvmChain.MUMBAI, ...options });
  }
}
