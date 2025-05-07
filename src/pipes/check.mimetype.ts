import {
    ArgumentMetadata,
    ConflictException,
    PipeTransform,
  } from '@nestjs/common';
  
  export class CheckMimeTypes implements PipeTransform {
    constructor(private readonly mimeTypes: string[]) {}
    transform(value: Express.Multer.File[], metadata: ArgumentMetadata) {
      for (let val of value) {
        if (!this.mimeTypes.includes(val.originalname.split('.')[1])) {
          console.log(val);
          throw new ConflictException(
            `the mime type of '${val.originalname.split('.')[1]}'  do not much for' ${this.mimeTypes}'`,
          );
        }
      }
  
      return value;
    }
  }
  