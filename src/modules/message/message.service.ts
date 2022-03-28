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
    messageDto.createTime = Date.now();
    return getRepository(MessageEntity).save(messageDto);
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

  /**
   * 查询Message列表
   */
  async getMessageAllList(messageDto) {
    const { prepage, page, sort = 0, isCheck } = messageDto;
    if (isCheck !== undefined) {
      return getRepository(MessageEntity)
        .createQueryBuilder('message')
        .where(`message.isCheck = ${isCheck}`)
        .orderBy('create_time', Number(sort) === 0 ? 'DESC' : 'ASC')
        .skip(prepage * (page - 1))
        .take(prepage * page)
        .getManyAndCount();
    }
    return getRepository(MessageEntity)
      .createQueryBuilder('message')
      .orderBy('create_time', Number(sort) === 0 ? 'DESC' : 'ASC')
      .skip(prepage * (page - 1))
      .take(prepage * page)
      .getManyAndCount();
  }

  /**
   * 删除 message
   */
  async removeMessage(id: number) {
    return getRepository(MessageEntity)
      .createQueryBuilder()
      .delete()
      .from(MessageEntity)
      .where('id = :id', { id })
      .execute();
  }

  /**
   * 已读 message
   */
  async readMessage(messageDto) {
    const { id } = messageDto;
    return getRepository(MessageEntity).update(id, { isRead: 1 });
  }

  /**
   * 审核 message
   */
  async checkMessage(messageDto) {
    const { id, isCheck } = messageDto;
    return getRepository(MessageEntity).update(id, { isCheck });
  }
}
