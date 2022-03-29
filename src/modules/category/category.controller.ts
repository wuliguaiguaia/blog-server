import { ArticleService } from './../article/article.service';
import { authConfig } from './../../common/constants/role';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
export class CategoryController {
  // logger: Logger;
  constructor(
    private readonly cateogoryService: CategoryService,
    private readonly articleService: ArticleService,
  ) {}

  /**
   * 获取分类列表
   */
  @Get('/list')
  async getCategoryList() {
    const response = await this.cateogoryService.getCategoryList();
    return {
      list: response.map((item) => {
        const { articles } = item;
        let len = 0;
        articles.forEach(({ deleted }) => {
          if (deleted === 0) {
            len++;
          }
        });
        item.articlesLen = len;
        delete item.articles;
        const { id, name, articlesLen, updateTime } = item;
        return { id, name, articlesLen, updateTime };
      }),
      total: response.length,
    };
  }

  /**
   * 增加分类
   */
  @Post()
  @Roles(authConfig.category.add)
  @UseGuards(AuthGuard('applySession'))
  async addCategory(@Body() categoryDto: CreateCategoryDto) {
    categoryDto.name = categoryDto.name.trim();
    const r = await this.cateogoryService.addCategory(categoryDto);
    if (r.raw) {
      return {
        id: r.raw.insertId,
      };
    }
  }

  /**
   * 更新分类
   */
  @Put()
  @Roles(authConfig.category.edit)
  @UseGuards(AuthGuard('applySession'))
  async updateCategory(@Body() categoryDto: UpdateCategoryDto) {
    categoryDto.name = categoryDto.name.trim();
    return await this.cateogoryService.updateCategory(categoryDto);
  }

  /**
   * 删除分类
   */
  @Delete()
  @Transaction()
  @Roles(authConfig.category.delete)
  @UseGuards(AuthGuard('applySession'))
  async removeCategory(
    @Body('id') id: number,
    @TransactionManager() manager: EntityManager,
  ) {
    const articles = await this.articleService.getArticleByCategory(id);
    const onlyIds = [];
    const andArticles = [];
    articles.forEach((item) => {
      const {
        _source: { categories, id: _id },
      } = item;
      if (categories.length === 1) {
        onlyIds.push(_id);
      } else {
        andArticles.push({ categories, id: _id });
      }
    });
    console.log(onlyIds, andArticles);
    for (const i of onlyIds) {
      await this.articleService.forceRemoveArticle(i, manager);
    }

    for (const item of andArticles) {
      const { categories, id: _id } = item;
      const cates = categories.filter((i) => i !== id);
      await this.articleService.updateArticle(
        { id: _id, categories: cates },
        manager,
      );
    }

    return await this.cateogoryService.removeCategory(+id, manager);
  }
}
