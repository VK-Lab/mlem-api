import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { BatchCreateNftsDto, CreateNftDto, GetNftsDto, UpdateNftDto } from '@/admin/dtos';
import { AdminNftService } from '@/admin/services';
import { Auth, ListDto, ParseObjectId, RoleEnum } from '@/common';
import { IdDto } from '@/common/dtos/id.dto';
import { Nft } from '@/modules/nft';

@Controller('admin/nfts')
@ApiTags('admin/nfts')
export class AdminNftController {
  constructor(private readonly adminNftService: AdminNftService) {}

  @ApiOkResponse({
    description: 'Get list nfts with pagination',
    type: ListDto<Nft>,
  })
  @Get('/')
  @Auth(RoleEnum.ADMIN)
  public async getClaims(@Query() getNftsDto: GetNftsDto): Promise<ListDto<Nft>> {
    return this.adminNftService.getNfts(getNftsDto);
  }

  @Put(':id')
  @Auth(RoleEnum.ADMIN)
  public async updateNft(@Param('id', ParseObjectId) id: Types.ObjectId, @Body() updateNftDto: UpdateNftDto): Promise<IdDto> {
    return this.adminNftService.updateNft(id, updateNftDto);
  }

  @Post('/')
  @Auth(RoleEnum.ADMIN)
  public async createNft(@Body() createNftDto: CreateNftDto): Promise<IdDto> {
    return this.adminNftService.createNft(createNftDto);
  }

  @Post('/batchCreate')
  @Auth(RoleEnum.ADMIN)
  public async batchCreate(@Body() batchCreateNftsDto: BatchCreateNftsDto): Promise<IdDto[]> {
    return this.adminNftService.batchCreateNftsDto(batchCreateNftsDto);
  }
}
