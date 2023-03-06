import {
  CLKey,
  CasperClient,
  Contracts,
  CLPublicKey,
} from 'casper-js-sdk';

import { Inject, Injectable } from '@nestjs/common';
import { ICasperModuleOption } from '../interfaces';
import { CONFIG_CONNECTION_OPTIONS } from '../constants';
import _ from 'lodash';

const { Contract } = Contracts;

@Injectable()
export class CasperCep78Service {
  private casperClient: CasperClient;

  public contractClient: Contracts.Contract;

  public networkName!: string;

  constructor(
    @Inject(CONFIG_CONNECTION_OPTIONS)
    _options: ICasperModuleOption,
  ) {
    this.casperClient = new CasperClient(_options.nodeUrl);
    this.contractClient = new Contract(this.casperClient);
    this.networkName = _options.networkName;
  };

  public setContractHash(contractHash: string, contractPackageHash?: string) {
    this.contractClient.setContractHash(contractHash, contractPackageHash);
  }

  public async getOwnerOf(tokenId: string) {
    const result = await this.contractClient.queryContractDictionary(
      'token_owners',
      tokenId
    );

    return `account-hash-${(result as CLKey).toJSON()}`;
  }

  public accountHashFromHex(publicKeyHex: string) {
    const clPublicKey = CLPublicKey.fromHex(publicKeyHex);
    return `${clPublicKey.toAccountHashStr()}`;
  }

  public async getOwnedTokenIds(publicKeyHex: string) {
    const clPublicKey = CLPublicKey.fromHex(publicKeyHex);

   try {
    const result = await this.contractClient.queryContractDictionary(
      'page_0',
      clPublicKey.toAccountHashStr().slice(13)
    );

    return result;
   } catch(err) {
    console.error(err);
    return [];
   }
  }
}
