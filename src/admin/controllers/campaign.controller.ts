import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { AdminCampaignService } from '../services';
import { CreateCampaignDto, GetCampaignsDto, UpdateCampaignDto } from '../dtos';

import { Auth, ListDto, ParseObjectId, ReqUser, RoleEnum } from '@/common';
import { Benefit } from '@/modules/benefit';
import { Payload } from '@/auth';
import { Campaign } from '@/modules/campaign';
import { IdDto } from '@/common/dtos/id.dto';

@Controller('admin/campaigns')
@ApiTags('admin/campaigns')
export class AdminCampaignController {
  constructor(private readonly adminCampaignService: AdminCampaignService) {}

  @ApiOkResponse({
    description: 'Get list campaigns with pagination',
    type: ListDto<Benefit>,
  })
  @Get('/')
  @Auth(RoleEnum.ADMIN)
  public async getCampaigns(@Query() getCampaignsDto: GetCampaignsDto): Promise<ListDto<Campaign>> {
    return this.adminCampaignService.getCampaigns(getCampaignsDto);
  }

  @ApiOkResponse({
    description: 'Create campaign',
    type: Benefit,
  })
  @Post('/')
  @Auth(RoleEnum.ADMIN)
  public async createCampaign(@ReqUser() user: Payload, @Body() createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return this.adminCampaignService.createCampaign(user.userId, createCampaignDto);
  }

  @Put(':id')
  @Auth(RoleEnum.ADMIN)
  public async updateCampaign(@Param('id', ParseObjectId) id: Types.ObjectId, @Body() updateNftDto: UpdateCampaignDto): Promise<IdDto> {
    return this.adminCampaignService.updateCampaign(id, updateNftDto);
  }
}
