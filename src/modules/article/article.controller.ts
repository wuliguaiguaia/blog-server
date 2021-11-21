import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { ArticleService } from './article.service';
import {
  CreateArticleDto,
  UpdateArticleDto,
  QueryArticleListDto,
  QueryArticleDto,
} from './dto/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 获取文章列表
   */
  @Get('/list')
  async getArticleList(@Query() articleDto: QueryArticleListDto) {
    const [list, total] = await this.articleService.getArticleList(articleDto);
    return { list, total };
  }

  /**
   * 获取文章
   */
  @Get()
  async getArticle(@Query() articleDto: QueryArticleDto) {
    return await this.articleService.getArticleById(articleDto);
  }

  /**
   * 增加文章
   */
  @Post()
  @Transaction()
  /* 可能出现两张表同时进行操作的情况
    因此开启事务事件：为了让同时进行的表操作要么一起完成，要么都失败
    @Transaction()和 @TransactionManager() manager: EntityManager 是事务的装饰器和对象 */
  async addArticle(
    @Body() articleDto: CreateArticleDto,
    @TransactionManager() manager: EntityManager,
  ) {
    return await this.articleService.addArticle(articleDto, manager);
  }
  /**
   * 更新文章
   */
  @Put()
  async updateArticle(@Body() articleDto: UpdateArticleDto) {
    return await this.articleService.updateArticle(articleDto);
  }

  /**
   * 删除文章
   */
  @Delete(':id')
  async removeArticle(@Param('id') id: string) {
    return await this.articleService.removeArticle(+id);
  }
}
