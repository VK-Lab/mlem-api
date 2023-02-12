import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';

import { Claim, ClaimDocument } from './schemas';
import { CreateClaimDto } from './dtos';

import { ListDto, PaginationDto } from '@/common';

@Injectable()
export class ClaimService {
  constructor(@InjectModel(Claim.name) private claimModel: Model<ClaimDocument>) {}

  public async createClaim(userId: Types.ObjectId, createClaimDto: CreateClaimDto): Promise<Claim> {
    try {
      const createdClaim = await this.claimModel.create({
        ...createClaimDto,
        createdBy: userId,
      });

      return createdClaim;
    } catch (err) {
      throw new BadRequestException('somethings_went_wrong');
    }
  }

  public async getClaims({ page, limit, sortBy, orderBy }: PaginationDto): Promise<ListDto<Claim>> {
    const claims = await this.claimModel
      .find()
      .limit(limit * 1)
      .sort({
        [sortBy]: orderBy,
      })
      .skip((page - 1) * limit)
      .populate('createdBy', 'phoneNumber walletAddress')
      .populate('benefit', '_id name')
      .populate('nft', '_id name tokenAddress tokenId');
    return {
      items: claims,
      total: await this.claimModel.countDocuments(),
    };
  }

  public async updateClaimStatus(id: Types.ObjectId, { status }: Partial<Claim>): Promise<UpdateWriteOpResult> {
    return this.claimModel.updateOne({
      _id: id,
    }, {
      status,
    });
  }
}
