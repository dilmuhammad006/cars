import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromise from 'fs/promises';

@Injectable()
export class fsHelper {
  async uploadFile(file: Express.Multer.File) {
    const fileFolder = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(fileFolder)) {
      fs.mkdirSync(fileFolder, { recursive: true });
    }

    let fileName = `${Date.now()}-file.${file.originalname.split('.')[1]}`;

    await fsPromise.writeFile(path.join(fileFolder, fileName), file.buffer);

    return {
      message: 'succes',
      fileUrl: path.join(fileName),
    };
  }

  async unlinkFile(name: string): Promise<void> {
    const fileFolder = path.join(process.cwd(), 'uploads', name);
    await fsPromise.unlink(fileFolder);
  }
}
