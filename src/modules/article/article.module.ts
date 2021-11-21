import { UserModule } from './../user/user.module';
import { ArticleEntity } from './../../entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), UserModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
