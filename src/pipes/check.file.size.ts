import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class CheckFilesize implements PipeTransform {
  constructor(private readonly size: number) {}

  transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
    for (const file of files) {
      if (file.size > this.size) {
        console.log(this.size / 1024 / 1024);
        console.log(file.size / 1024);
        throw new BadRequestException(
          `File "${file.originalname}" exceeds the limit of ${(this.size / 1024 / 1024).toFixed(2)} MB. Your file size is ${(file.size / 1024 / 1024).toFixed(2)} MB.`,
        );
      }
    }
    return files;
  }
}
