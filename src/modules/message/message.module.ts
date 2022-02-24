import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WsStartGateway } from 'src/common/ws/ws.gateway';
import { MessageEntity } from 'src/entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  controllers: [MessageController],
  providers: [MessageService, WsStartGateway],
  exports: [MessageService],
})
export class MessageModule {}
