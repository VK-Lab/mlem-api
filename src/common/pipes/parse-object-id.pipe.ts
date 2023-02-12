import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectId implements PipeTransform {
  public transform(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _metadata: ArgumentMetadata,
  ): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid_id');
    }

    return new Types.ObjectId(id);
  }
}
