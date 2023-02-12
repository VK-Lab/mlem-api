import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';

import { Benefit, BenefitDocument } from './schemas';

import { ListDto, PaginationDto } from '@/common';

@Injectable()
export class BenefitService {
  constructor(@InjectModel(Benefit.name) private benefitModel: Model<BenefitDocument>) {}

  public async createBenefit(benefit: Partial<Benefit>): Promise<Benefit> {
    return this.benefitModel.create({
      ...benefit,
    });
  }

  public async findById(id: string | Types.ObjectId): Promise<Benefit | null> {
    return this.benefitModel.findById(id);
  }


  public async updateBenefit(id: Types.ObjectId, benefit: Partial<Omit<Benefit, 'id'>>): Promise<UpdateWriteOpResult> {
    return this.benefitModel.updateOne({
      _id: id,
    }, {
      ...benefit,
    });
  }

  public async getBenefits({ page, limit, sortBy, orderBy }: PaginationDto): Promise<ListDto<Benefit>> {
    const claims = await this.benefitModel
      .find()
      .sort({
        [sortBy]: orderBy,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'phoneNumber walletAddress');
    return {
      items: claims,
      total: await this.benefitModel.countDocuments(),
    };
  }
}
