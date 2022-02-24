import {
  MessageDto,
  AllQueryMessageDto,
  UpdateMessageDto,
} from './dto/message.dto';
import { MessageService } from './message.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { WsStartGateway } from 'src/common/ws/ws.gateway';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly ws: WsStartGateway,
  ) {}
  /**
   * 获取message列表
   */
  @Get('list')
  async getMessageList() {
    return await this.messageService.getMessageList();
  }

  /**
   * 获取message列表
   */
  @Get('list/all')
  async getMessageAllList(@Query() messageDto: AllQueryMessageDto) {
    const [list, total] = await this.messageService.getMessageAllList(
      messageDto,
    );
    return { list, total };
  }

  /**
   * 增加 message
   */
  @Post()
  async addMessage(@Body() messageDto: MessageDto) {
    const data = await this.messageService.addMessage(messageDto);
    console.log(3333);
    console.log(this.ws.server.sockets);

    // this.ws.server.emit('newComment', { data: 'Nest' });
    // this.ws.server.newComment({ s: 11 });
    // this.ws.server.emit('createD', { data: '穷哈哈哈' });
    this.ws.server.emit('createD', { data: '穷哈哈哈' });

    return { id: data.id };
  }

  /**
   * 已读 message
   */
  @Put('/read')
  async readMessage(@Body() messageDto: UpdateMessageDto) {
    await this.messageService.readMessage(messageDto);
    return true;
  }

  /* 审核留言 */
  @Put('/check')
  async checkMessage(@Body() CommentDto: UpdateMessageDto) {
    await this.messageService.checkMessage(CommentDto);
    return true;
  }

  /**
   * 删除 message
   */
  @Delete()
  async removeMessage(@Body() messageDto) {
    await this.messageService.removeMessage(messageDto);
    return true;
  }
}
