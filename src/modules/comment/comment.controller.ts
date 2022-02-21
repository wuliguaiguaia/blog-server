import { CreateCommentDto, QueryCommentDto } from './dto/comment.dto';
import { CommentService } from './comment.service';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';

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
        const cur = res[i];
        cur.replyInfo.push(item);
      }
      return res;
    }, []);
    return res.reverse();
  }

  /**
   * 增加 Comment
   */
  @Post()
  async addComment(@Body() CommentDto: CreateCommentDto) {
    await this.commentService.addComment(CommentDto);
    return true;
  }

  /**
   * 删除 Comment
   */
  @Delete()
  async removeComment(@Body() CommentDto) {
    await this.commentService.removeComment(CommentDto);
    return true;
  }
}