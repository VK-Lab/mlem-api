import { Injectable } from '@nestjs/common';
import Moralis from 'moralis';
import { EvmNftCollection, EvmChain, EvmNft, EvmNftData } from '@moralisweb3/evm-utils';
import { PaginatedResult } from '@moralisweb3/api-utils';
import _ from 'lodash';

import { GetWalletNft } from '@/common';

const MAX_TOTAL_PAGE = 10000;
const MAX_LIMIT = 100;
@Injectable()
export class MoralisService {
  public async getWalletNfts(
    address: string,
    { chain, cursor, limit = MAX_LIMIT }: { chain: EvmChain; cursor?: string; limit: number },
  ): Promise<PaginatedResult<EvmNftData[]>> {
    const paginatedResult = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
      cursor,
      limit,
    });

    const nfts = _.map(paginatedResult.toJSON(), (nft: EvmNftData) => {
      return this.massageNft(nft);
    });

    return <PaginatedResult<EvmNftData[]>>(<unknown>{
      ...paginatedResult.pagination,
      result: nfts,
    });
  }

  public async getWalletNftCollections(
    address: string,
    { chain, cursor, limit = MAX_LIMIT }: { chain: EvmChain; cursor?: string; limit: number },
  ): Promise<PaginatedResult<EvmNftCollection[]>> {
    const data = await Moralis.EvmApi.nft.getWalletNFTCollections({
      address,
      chain,
      cursor,
      limit,
    });

    return <PaginatedResult<EvmNftCollection[]>>(<unknown>{
      ...data.pagination,
      result: <EvmNftCollection[]>(<unknown>data.toJSON()),
    });
  }

  public async getNftCollectionMetadata(address: string, { chain }: { chain: EvmChain }): Promise<EvmNftCollection | null> {
    const response = await Moralis.EvmApi.nft.getNFTContractMetadata({
      address,
      chain,
    });

    return <EvmNftCollection>(<unknown>response?.toJSON());
  }

  public async getNftsFromCollection(
    contractAddress: string,
    { chain, cursor, limit = MAX_LIMIT }: { chain: EvmChain; cursor?: string; limit: number },
  ): Promise<PaginatedResult<EvmNft[]>> {
    const paginatedResult = await Moralis.EvmApi.nft.getNFTOwners({
      address: contractAddress,
      chain,
      cursor,
      limit,
    });

    return <PaginatedResult<EvmNft[]>>(<unknown>paginatedResult.toJSON());
  }

  public async getAllNftsFromCollection(contractAddress: string, { chain }: { chain: EvmChain }): Promise<EvmNftData[]> {
    let cursor;
    let nfts: EvmNftData[] = [];
    for (let index = 0; index < MAX_TOTAL_PAGE; index++) {
      const response = await Moralis.EvmApi.nft.getNFTOwners({
        address: contractAddress,
        chain,
        cursor,
        limit: MAX_LIMIT,
      });
      const result = <EvmNftData[]>(<unknown>response.toJSON());
      nfts = [...nfts, ...result];
      cursor = response.pagination.cursor;
      if (!cursor) {
        break;
      }

      break;
    }

    return nfts;
  }

  public async getNftMetadata(address: string, { tokenId, chain }: GetWalletNft): Promise<EvmNftData | null> {
    const response = await Moralis.EvmApi.nft.getNFTMetadata({
      address,
      chain,
      tokenId,
    });

    const nft = <EvmNftData>(<unknown>response?.toJSON());

    if (_.isEmpty(nft)) {
      return null;
    }

    return this.massageNft(nft);
  }

  public massageNft(nft: EvmNftData): EvmNftData {
    if (_.isEmpty(nft.metadata)) {
      return nft;
    }

    return <EvmNftData>(<unknown>{
      ...nft,
      metadata: {
        ..._.get(nft, 'metadata', {}),
        // Free bandwith from nft.storage.
        image: this.replaceIpfsWithExternalStorage(<string>_.get(nft, 'metadata.image', '')),
      },
    });
  }

  private replaceIpfsWithExternalStorage(ipf: string, defaultValue: string = ''): string {
    if (_.isEmpty(ipf)) {
      return defaultValue;
    }

    return _.replace(ipf, 'ipfs://', 'https://nftstorage.link/ipfs/');
  }
}
