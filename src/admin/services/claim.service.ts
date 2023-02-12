import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { UpdateClaimStatusDto, GetClaimsDto } from '../dtos';

import { Claim, ClaimService } from '@/modules/claim';
import { IdDto } from '@/common/dtos/id.dto';
import { ListDto } from '@/common';

@Injectable()
export class AdminClaimService {
  constructor(
    private readonly claimService: ClaimService) {

  }

  public async getClaims(getClaimsDto: GetClaimsDto): Promise<ListDto<Claim>> {
    return this.claimService.getClaims(getClaimsDto);
  }

  public async updateClaimStatus(id: Types.ObjectId, updateClaimStatusDto: UpdateClaimStatusDto): Promise<IdDto> {
    const result = await this.claimService.updateClaimStatus(id, updateClaimStatusDto);

    if (result.modifiedCount === 0) {
      throw new BadRequestException('can_not_update_claim');
    }

    return {
      id: id.toString(),
    };
  }
}
