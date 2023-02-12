import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseFile implements PipeTransform {
  public transform(
    files: Express.Multer.File | Express.Multer.File[],
    _metadata: ArgumentMetadata,
  ): Express.Multer.File | Express.Multer.File[] {
    if (files === undefined || files === null) {
      throw new BadRequestException('file_expected');
    }

    if (Array.isArray(files) && files.length === 0) {
      throw new BadRequestException('file_expected');
    }

    return files;
  }
}
