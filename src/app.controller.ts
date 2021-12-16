import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(@Req() req, @Res() res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return this.appService.upload(file);
  }
}
