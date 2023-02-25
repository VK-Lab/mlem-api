import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { CasperCep78Service } from '@libs/casper';

import { Nft, NftDocument } from './schemas';
import { Erc721Metadata, NftId } from './interfaces';
import { NftDetailDto } from './dtos/nft-detail.dto';

import { ClaimStatusEnum, ListDto, Logger, PaginationDto } from '@/common';
import { Benefit } from '@/modules/benefit';
import { Claim, ClaimService } from '@/modules/claim';
import { Payload } from '@/auth';
import { User, UserService } from '@/modules/user';

@Injectable()
export class NftService {
  constructor(
    @InjectModel(Nft.name) private nftModel: Model<NftDocument>,
    private readonly userService: UserService,
    private readonly logger: Logger,
    private readonly claimService: ClaimService,
    private readonly casperCep78Service: CasperCep78Service,
  ) {
    this.logger.setContext(NftService.name);
  }

  public async createNft(nft: Partial<Nft>): Promise<Nft> {
    return this.nftModel.create(nft);
  }

  public async insertMany(nfts: Partial<Nft>[]): Promise<Nft[]> {
    return this.nftModel.insertMany(nfts);
  }

  public async findByTokenAddressAndTokenId(tokenAddress: string, tokenId: string): Promise<Nft | null> {
    return this.nftModel.findOne({ tokenAddress, tokenId });
  }

  public async getNft(user: Payload, { tokenAddress, tokenId }: { tokenAddress: string; tokenId: string }): Promise<NftDetailDto> {
    this.casperCep78Service.setContractHash(
      `hash-${tokenAddress}`,
      undefined,
    );
    const accountHash = await this.casperCep78Service.getOwnerOf(tokenId);
    const myAccountHash = this.casperCep78Service.accountHashFromHex(user.walletAddress);
    if (accountHash !== myAccountHash) {
      throw new BadRequestException('nft_not_found');
    }

    const foundNft = await this.nftModel
      .findOne({ tokenAddress: tokenAddress.toLowerCase(), tokenId })
      .populate('benefits', '_id name')
      .populate({
        path: 'nftCollection',
        select: 'benefitIds name description',
        populate: {
          path: 'benefits',
          select: 'id name',
        },
      })
      .populate('claims', '_id benefitId status');

    if (_.isEmpty(foundNft)) {
      throw new BadRequestException('nft_not_found');
    }

    const nftData = <Nft>foundNft.toJSON();

    return {
      ...nftData,
      benefits: <NftDetailDto['benefits']> this.getAllBenefitsWithCollection(foundNft),
      contractType: 'CEP78',
      ownerOf: 'asdasdasd',
    };
  }

  public async getNftMetadata(tokenAddress: string, tokenId: string): Promise<Erc721Metadata> {
    const foundNft = await this.nftModel
      .findOne({ tokenAddress: tokenAddress.toLowerCase(), tokenId })
      .populate('benefits', '_id name')
      .populate({
        path: 'nftCollection',
        select: 'benefitIds name description',
        populate: {
          path: 'benefits',
          select: 'id name',
        },
      })
      .populate('claims', '_id benefitId status');

    return this.generateNftMetadata(<Nft>foundNft);
  }

  public async getNftMetadataById(id: Types.ObjectId): Promise<Erc721Metadata> {
    const foundNft = await this.nftModel.findOne({ _id: id }).populate('benefits', '_id name').populate('claims', '_id benefitId status');

    return this.generateNftMetadata(<Nft>foundNft);
  }

  public isClaimedBenefit(foundNft: Nft, benefit: Benefit): boolean {
    return foundNft?.claims
      ? (<Claim[]>(<unknown>foundNft?.claims)).findIndex(
        (claim: Claim) => claim.benefitId.toString() === benefit._id.toString() && claim.status === ClaimStatusEnum.ACCEPTED,
      ) !== -1
      : false;
  }

  public async getNfts(user: Payload): Promise<NftDetailDto[]> {
    const nfts = await this.nftModel.find();

    const tokenAddresses = _.uniq(_.map(nfts, 'tokenAddress'));

    let existedNfts = {};
    for (const tokenAddress of tokenAddresses) {
      this.casperCep78Service.setContractHash(`hash-${tokenAddress}`);
      const result = await this.casperCep78Service.getOwnedTokenIds(user.walletAddress);
      existedNfts = {
        ...existedNfts,
        [tokenAddress]: _.map(<any[]>_.get(result, 'data', []), 'data'),
      };
    }

    const filteredNfts = nfts.filter((nft: Nft) => {
      return _.get(existedNfts, `${nft.tokenAddress}[${nft.tokenId}]`, false) === true;
    });

    const nftDetails = <NftDetailDto[]>filteredNfts.map((nft: Nft & NftDocument) => {
      return {
        ..._.omit(nft.toJSON(), ['benefits']),
        contractType: 'CEP78',
        ownerOf: 'asdasdasd',
      };
    });

    return nftDetails;
  }

  public async updateNftById(id: Types.ObjectId, nft: Partial<Nft>): Promise<UpdateWriteOpResult> {
    return this.nftModel.updateOne(
      { _id: id },
      {
        ...nft,
      },
    );
  }

  public async getPaginatedNfts({ page, limit, sortBy, orderBy }: PaginationDto): Promise<ListDto<Nft>> {
    const claims = await this.nftModel
      .find()
      .sort({
        [sortBy]: orderBy,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('benefits', '_id name')
      .populate('claims', '_id benefitId status');
    return {
      items: claims,
      total: await this.nftModel.countDocuments(),
    };
  }

  public async claimBenefit(user: Payload, nftId: Types.ObjectId, benefitId: Types.ObjectId): Promise<NftId> {
    // const foundUser = await this.userService.findById(user.userId);
    const foundNft = await this.nftModel.findById(nftId);
    if (!foundNft) {
      throw new BadRequestException('nft_not_found');
    }
    await this.checkOwnedNft(user.userId, { tokenAddress: foundNft.tokenAddress, tokenId: foundNft.tokenId });

    const createdClaim = await this.claimService.createClaim(user.userId, { nftId, benefitId });

    await this.nftModel.updateOne(
      { _id: nftId },
      {
        $push: {
          claims: createdClaim._id,
        },
      },
    );

    // const benefit = await this.benefitService.findById(benefitId);

    // await this.telegramService.sendMessage(`
    // *New Claim Request* 🔥 🔥
    // User: ${foundUser?.phoneNumber}
    // NFT: ${foundNft.name.replace('#', '\\#')}
    // Benefit: ${benefit?.name.replace('#', '\\#')}
    // createdAt: ${moment().format('lll')}
    // 👉 [Claim](https://app.mlem.com/admin/dashboard)
    // (${createdClaim._id})
    // `);

    return {
      id: nftId.toString(),
    };
  }

  public async checkOwnedNft(
    userId: Types.ObjectId,
    { tokenAddress, tokenId }: { tokenAddress: string; tokenId: string },
  ): Promise<{ user: User }> {
    const foundUser = await this.userService.findById(userId);
    if (!foundUser) {
      throw new ForbiddenException('user_not_found');
    }
    this.casperCep78Service.setContractHash(
      `hash-${tokenAddress}`,
      undefined,
    );
    const accountHash = await this.casperCep78Service.getOwnerOf(tokenId);
    const myAccountHash = this.casperCep78Service.accountHashFromHex(foundUser.walletAddress);
    if (accountHash !== myAccountHash) {
      throw new ForbiddenException('nft_not_found');
    }

    return {
      user: foundUser,
    };
  }

  public async upsertMany(nfts: Nft[]): Promise<void> {
    const bulkOps = nfts.map((nft: Nft) => {
      return {
        updateOne: {
          filter: { tokenHash: nft.tokenHash },
          update: nft,
          upsert: true,
        },
      };
    });

    const result = await this.nftModel.bulkWrite(bulkOps);

    this.logger.log(`Inserted ${result.insertedCount} and modified ${result.modifiedCount}`);
  }

  private getAllBenefitsWithCollection(nft: Nft): Benefit[] {
    const collectionBenefits = <Benefit[]>_.get(nft, 'nftCollection.benefits', []);

    const benefits = _.concat(<Benefit[]>nft.benefits, collectionBenefits);

    if (_.isEmpty(benefits)) {
      return [];
    }

    const uniqueBenefits = _.uniqBy(
      benefits,
      'id',
    );

    return uniqueBenefits;
  }

  private generateNftMetadata(nft?: Nft): Erc721Metadata {
    if (!nft) {
      return {
        image: '',
        name: '',
        description: '',
        attributes: [],
      };
    }

    return {
      image: nft.imageUrl,
      name: nft.name,
      description: nft.description,
      attributes: _.map(this.getAllBenefitsWithCollection(nft), (benefit: Benefit) => {
        const isClaimed = this.isClaimedBenefit(nft, benefit);

        return {
          trait_type: benefit.name,
          value: isClaimed ? 'Claimed' : 'Available',
        };
      }),
    };
  }
}
