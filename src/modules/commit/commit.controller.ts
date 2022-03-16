import { CommitService } from './commit.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('commit')
@UseGuards(AuthGuard('applySession'))
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
