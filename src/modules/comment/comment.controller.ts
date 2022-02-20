import { CommentDto } from './dto/comment.dto';
import {CommentService } from './comment.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 获取message列表
   */
  @Get()
  async getMessageList() {
    return await this.commentService.getCommentList();
  }
 
  /**
   * 增加 message
   */
  @Post()
  async addMessage(@Body() messageDto: CommentDto) {
    console.log(messageDto);
    
    return await this.commentService.addComment(messageDto);
  }
}
