import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
