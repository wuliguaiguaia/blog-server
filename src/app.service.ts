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
    let dir = config.get('assetsPath');
    const dirArr = dir.split('/')
    const assetsDirName = dirArr[dirArr.length - 1]
    const { originalname, encoding, mimetype, buffer } = file;
    const types = /(image|video|audio)/ig;
    let fileType = '';
    if (types.test(mimetype)) {
      fileType = RegExp.$1;
      dir = path.join(dir, fileType);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    } else {
      // 报错返回
      return {filePath: null}
    }
    let fileName = genFileName(originalname);
    dir = path.join(dir, fileName);
    fs.writeFileSync(dir, buffer, 'binary'); // 默认binary
    const realPath = config.get('domain') + '/' + path.join(assetsDirName, fileType, fileName)
    return {
      filePath: realPath
    };
  }
}
