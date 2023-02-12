import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { GetBenefitsDto, CreateBenefitDto } from '../dtos';

import { ListDto } from '@/common';
import { Benefit, BenefitService } from '@/modules/benefit';

@Injectable()
export class AdminBenefitService {
  constructor(private readonly benefitService: BenefitService) {}

  public async getBenefits(getClaimsDto: GetBenefitsDto): Promise<ListDto<Benefit>> {
    return this.benefitService.getBenefits(getClaimsDto);
  }

  public async createBenefit(userId: Types.ObjectId, createBenefitDto: CreateBenefitDto): Promise<Benefit> {
    return this.benefitService.createBenefit({
      ...createBenefitDto,
      createdBy: userId,
    });
  }
}
