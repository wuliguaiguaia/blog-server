import { ArticleEntity } from 'src/entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { ArticleService } from '../article/article.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ArticleEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, ArticleService], // 必须进行注入
})
export class CategoryModule {}
