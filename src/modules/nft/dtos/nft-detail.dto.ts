import { Nft } from '../schemas';

import { Benefit } from '@/modules/benefit';

export class NftDetailDto extends Nft {
  public override benefits?: Benefit[];
  public contractType?: string;
  public ownerOf?: string;
}
