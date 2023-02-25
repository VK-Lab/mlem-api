import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateWriteOpResult } from 'mongoose';

import { NftCollection, NftCollectionDocument } from './schemas';

import { ListDto, PaginationDto } from '@/common';

@Injectable()
export class NftCollectionService {
  constructor(
    @InjectModel(NftCollection.name) private nftCollectionModel: Model<NftCollectionDocument>,
  ) {}

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


}
