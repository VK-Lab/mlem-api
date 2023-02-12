import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { AdminClaimService } from '../services';
import { GetClaimsDto, UpdateClaimStatusDto } from '../dtos';

import { Auth, ListDto, ParseObjectId, RoleEnum } from '@/common';
import { Claim } from '@/modules/claim';
import { IdDto } from '@/common/dtos/id.dto';

@Controller('admin/claims')
@ApiTags('admin/claims')
export class AdminClaimController {
  constructor(private readonly adminClaimService: AdminClaimService) {}

  @ApiOkResponse({
    description: 'Get list nfts with pagination',
    type: ListDto<Claim>,
  })
  @Get('/')
  @Auth(RoleEnum.ADMIN)
  public async getClaims(
    @Query() getClaimsDto: GetClaimsDto,
  ): Promise<ListDto<Claim>> {
    return this.adminClaimService.getClaims(getClaimsDto);
  }

  @Put(':id/status')
  @Auth(RoleEnum.ADMIN)
  public async updateClaimStatus(
    @Param('id', ParseObjectId) id: Types.ObjectId, @Body() updateClaimStatusDto: UpdateClaimStatusDto): Promise<IdDto> {
    return this.adminClaimService.updateClaimStatus(id, updateClaimStatusDto);
  }
}
