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
import { ArticleService } from './article.service';
import {
  CreateArticleDto,
  UpdateArticleDto,
  QueryArticleDto,
} from './dto/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 获取文章列表
   */
  @Get()
  async getArticleList(@Query() articleDto: QueryArticleDto) {
    return await this.articleService.getArticleList(articleDto);
  }

  /**
   * 增加文章
   */
  @Post()
  async addArticle(@Body() articleDto: CreateArticleDto) {
    return await this.articleService.addArticle(articleDto);
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
