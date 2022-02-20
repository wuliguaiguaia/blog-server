/*
 * service 提供操作数据库服务接口
 */
import { getRepository } from 'typeorm';
import { EntityRepository } from 'typeorm';
import { MessageEntity } from 'src/entities/message.entity';

@EntityRepository(MessageEntity)
export class MessageService {
  /**
   * 增加message
   */
  async addMessage(messageDto) {
    return getRepository(MessageEntity).save(messageDto)
  }

  /**
   * 更新message
   */
  async updateMessage() {}

  /**
   * 查询message列表
   */
  async getMessageList() {
    return getRepository(MessageEntity)
      .createQueryBuilder('message')
      .getManyAndCount();
  }
}
