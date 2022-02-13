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
    console.log('file:', file);
    console.log('dirname:', __dirname);
    console.log('cwd:', process.cwd());
    let dir = config.get('assetsPath');
    const { originalname, encoding, mimetype, buffer } = file;
    console.log('encoding:', encoding);
    console.log('mimetype:', mimetype);
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
    const realPath = path.join(config.get('domain'), fileType, fileName)
    console.log('filepath:', dir);
    console.log('realPath:', realPath);
    return {
      filePath: realPath
    };
  }
}
