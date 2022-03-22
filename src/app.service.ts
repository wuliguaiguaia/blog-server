import { Injectable } from '@nestjs/common';
import * as config from 'config';
import * as path from 'path';
import * as fs from 'fs';
import { md5 } from './common/utils';
import { MyLogger } from './common/utils/logger.service';
@Injectable()
export class AppService {
  constructor(private readonly logger: MyLogger) {}
  getHello(): string {
    return 'Hello World!';
  }

  upload(file) {
    let dir = config.get('assetsPath');
    const dirArr = dir.split('/');
    const assetsDirName = dirArr[dirArr.length - 1];
    const { originalname, encoding, mimetype, buffer } = file;
    const types = /(image|video|audio)/gi;
    let fileType = '';
    if (types.test(mimetype)) {
      fileType = RegExp.$1;
      dir = path.join(dir, fileType);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    } else {
      // 报错返回
      return { filePath: null };
    }

    const fileName = md5(buffer) + path.extname(originalname);
    this.logger.log('upload', fileName);
    dir = path.join(dir, fileName);
    fs.writeFileSync(dir, buffer, 'binary'); // 默认binary
    const realPath =
      config.get('domain') + '/' + path.join(assetsDirName, fileType, fileName);
    return {
      filePath: realPath,
    };
  }
}
