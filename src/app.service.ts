import { genFileName } from './common/utils/genId';
import { Injectable } from '@nestjs/common';
import * as config from 'config';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  upload(file) {
    console.log(file, '---');

    const assetsPath = config.get('assetsPath');
    let dir = path.join(__dirname, '..', assetsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const { originalname, encoding, mimetype, buffer } = file;
    console.log(encoding, dir);
    const types = /(image|video|audio)/;
    let fileType = '';

    if (types.test(mimetype)) {
      fileType = RegExp.$1;
      dir = path.join(dir, fileType);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }
    let fileName = originalname;
    let filePath = path.join(dir, fileName);
    if (fs.existsSync(filePath)) {
      fileName = genFileName(fileName);
      filePath = path.join(dir, fileName);
    }
    fs.writeFileSync(filePath, buffer, 'binary'); // 默认binary
    return {
      filePath: path.join(`${assetsPath}/${fileType}/${fileName}`),
    };
  }
}
