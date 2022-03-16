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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/role.decorator';
import { authConfig } from 'src/common/constants/role';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  /**
   * 获取message列表
   */
  @Get('list')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.message)
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
    return await this.messageService.addMessage(messageDto);
  }

  /**
   * 已读 message
   */
  @Put('/read')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.message)
  async readMessage(@Body() messageDto: UpdateMessageDto) {
    await this.messageService.readMessage(messageDto);
    return true;
  }

  /* 审核留言 */
  @Put('/check')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.message)
  async checkMessage(@Body() CommentDto: UpdateMessageDto) {
    await this.messageService.checkMessage(CommentDto);
    return true;
  }

  /**
   * 删除 message
   */
  @Delete()
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.message)
  async removeMessage(@Body('id') id: number) {
    return await this.messageService.removeMessage(+id);
  }
}
