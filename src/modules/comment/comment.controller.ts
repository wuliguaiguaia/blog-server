import {
  AllQueryCommentDto,
  CreateCommentDto,
  QueryCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { CommentService } from './comment.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { authConfig } from './../../common/constants/role';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 获取Comment列表
   */
  @Get('list')
  async getCommentListById(@Query() commentDto: QueryCommentDto) {
    const data = await this.commentService.getCommentListById(commentDto);
    const topLevel = []; /* 顶级 comment */
    const res = data.reduce((res, item) => {
      if (!item.replyId) {
        res.push({ ...item, replyInfo: [] });
        topLevel.push(item.id);
      } else if (item.replyId) {
        const i = topLevel.indexOf(item.replyId);
        if (i > -1) {
          const cur = res[i];
          cur.replyInfo.push(item);
        }
      }
      return res;
    }, []);
    return res.reverse();
  }

  /**
   * 获取Comment列表
   */
  @Get('list/all')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.comment)
  async getCommentList(@Query() commentDto: AllQueryCommentDto) {
    const [list, total] = await this.commentService.getCommentList(commentDto);
    return { list, total };
  }

  /**
   * 增加 Comment
   */
  @Post()
  async addComment(@Body() CommentDto: CreateCommentDto) {
    await this.commentService.addComment(CommentDto);
    return true;
  }

  /* 已读留言 */
  @Put('/read')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.comment)
  async readComment(@Body() CommentDto: UpdateCommentDto) {
    await this.commentService.readComment(CommentDto);
    return true;
  }

  /* 审核留言 */
  @Put('/check')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.comment)
  async checkComment(@Body() CommentDto: UpdateCommentDto) {
    await this.commentService.checkComment(CommentDto);
    return true;
  }

  /**
   * 删除 Comment
   */
  @Delete()
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.comment)
  async removeComment(@Body('id') id: number) {
    return await this.commentService.removeComment(+id);
  }
}
