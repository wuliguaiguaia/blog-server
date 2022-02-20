import { MessageDto } from './dto/message.dto';
import {MessageService } from './message.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * 获取message列表
   */
  @Get()
  async getMessageList() {
    return await this.messageService.getMessageList();
  }
 
  /**
   * 增加 message
   */
  @Post()
  async addMessage(@Body() messageDto: MessageDto) {
    return await this.messageService.addMessage(messageDto);
  }
}
