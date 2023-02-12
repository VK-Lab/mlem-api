import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { AdminNftCollectionService } from '../services';
import { CreateNftCollectionDto, GetNftCollectionsDto, UpdateNftCollectionDto } from '../dtos';

import { Auth, ListDto, ParseObjectId, RoleEnum } from '@/common';
import { IdDto } from '@/common/dtos/id.dto';
import { Nft } from '@/modules/nft';
import { NftCollection } from '@/modules/nft-collection';

@Controller('admin/nft-collections')
@ApiTags('admin/nft-collections')
export class AdminNftCollectionController {
  constructor(private readonly adminNftCollectionService: AdminNftCollectionService) {}

  @ApiOkResponse({
    description: 'Get list nft-collections with pagination',
    type: ListDto<Nft>,
  })
  @Get('/')
  @Auth(RoleEnum.ADMIN)
  public async getNftCollections(@Query() getNftCollectionsDto: GetNftCollectionsDto): Promise<ListDto<NftCollection>> {
    return this.adminNftCollectionService.getNftCollections(getNftCollectionsDto);
  }

  @Put(':id')
  @Auth(RoleEnum.ADMIN)
  public async updateNftCollection(
    @Param('id', ParseObjectId) id: Types.ObjectId, @Body() updateNftCollectionDto: UpdateNftCollectionDto): Promise<IdDto> {
    return this.adminNftCollectionService.updateNftCollection(id, updateNftCollectionDto);
  }

  @Post('/')
  @Auth(RoleEnum.ADMIN)
  public async createNftCollection(@Body() createNftCollectionDto: CreateNftCollectionDto): Promise<IdDto> {
    return this.adminNftCollectionService.createNftCollection(createNftCollectionDto);
  }
}
