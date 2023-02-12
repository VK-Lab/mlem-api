import { EvmChain } from '@moralisweb3/evm-utils';

export interface GetWalletNft {
  tokenId: string;
  chain: EvmChain;
}
