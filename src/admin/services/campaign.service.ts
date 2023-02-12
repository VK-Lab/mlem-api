import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { GetCampaignsDto, UpdateCampaignDto, CreateCampaignDto } from '../dtos';

import { IdDto } from '@/common/dtos/id.dto';
import { ListDto } from '@/common';
import { CampaignService } from '@/modules/campaign/campaign.service';
import { Campaign } from '@/modules/campaign/schemas';
import { NftCollectionService } from '@/modules/nft-collection';

@Injectable()
export class AdminCampaignService {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly nftCollectionService: NftCollectionService,
  ) {
  }

  public async getCampaigns(getCampaignsDto: GetCampaignsDto): Promise<ListDto<Campaign>> {
    return this.campaignService.getCampaigns(getCampaignsDto);
  }

  public async updateCampaign(id: Types.ObjectId, updateCampaignDto: UpdateCampaignDto): Promise<IdDto> {
    const foundCapaign = await this.campaignService.findById(id);
    if (!foundCapaign) {
      throw new BadRequestException('campaign_does_not_exist');
    }

    if (foundCapaign.nftCollectionIds) {
      await this.nftCollectionService.unsetCampaignIds(foundCapaign.nftCollectionIds);
    }

    if (updateCampaignDto.nftCollectionIds) {
      await this.nftCollectionService.updateCampaignIds(updateCampaignDto.nftCollectionIds, id);
    }

    const result = await this.campaignService.updateCampaign(id, updateCampaignDto);

    if (result.modifiedCount === 0) {
      throw new BadRequestException('can_not_update_campaign');
    }

    return {
      id: id.toString(),
    };
  }

  public async createCampaign(userId: Types.ObjectId, createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const createdCampaign = await this.campaignService.createCampaign({
      ...createCampaignDto,
      createdBy: userId,
    });

    if (createCampaignDto.nftCollectionIds) {
      await this.nftCollectionService.updateCampaignIds(createCampaignDto.nftCollectionIds, createdCampaign._id);
    }

    return createdCampaign;
  }
}
