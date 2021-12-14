import { CommitService } from './commit.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('commit')
export class CommitController {
  constructor(private readonly commitService: CommitService) {}

  /**
   * 获取commit列表
   */
  @Get()
  async getCommitList(@Query() commitDto) {
    return await this.commitService.getCommitList(commitDto);
  }
}
