import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryEntity } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService], // 必须进行注入
})
export class CategoryModule {}
