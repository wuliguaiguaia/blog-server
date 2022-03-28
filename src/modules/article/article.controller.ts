import { authConfig } from './../../common/constants/role';
import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { ArticleService } from './article.service';
import { CommitService } from './../commit/commit.service';
import {
  CreateArticleDto,
  UpdateArticleDto,
  QueryArticleListDto,
  QueryArticleDto,
} from './dto/article.dto';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commitService: CommitService,
  ) {}

  /**
   * 获取文章列表
   */
  @Get('/list')
  @Transaction()
  async getArticleList(
    @Query() articleDto: QueryArticleListDto,
    @TransactionManager() manger: EntityManager,
  ) {
    const [total, list, esTookTime = 0] =
      await this.articleService.getArticleListES(articleDto, manger);
    return {
      esTookTime,
      total,
      list,
    };
  }

  /**
   * 模糊搜索
   */
  @Get('/search')
  async getArticleListFromSearch(@Query() articleDto: QueryArticleListDto) {
    const [esTookTime, list, total, max_score] =
      await this.articleService.getArticleListFromSearchES(articleDto);
    return {
      esTookTime,
      total: total.value,
      max_score,
      list: list.map((item) => {
        delete item._index;
        delete item._type;
        delete item._source.content;
        item._source.categories = item._source.categories.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });

        item.highlight.title = item.highlight.title[0];
        item.highlight.content =
          item.highlight['content.content'].join('...') + '...';
        delete item.highlight['content.content'];
        return item;
      }),
    };
  }

  /**
   * 获取文章
   */
  @Get()
  async getArticle(@Query() articleDto: QueryArticleDto) {
    /* const {
      _source,
      _source: { categories, content },
    } = await this.articleService.getArticleByIdES(articleDto);

    _source.categories = categories.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    _source.content = content.content;
    return _source; */
    const data = await this.articleService.getArticleById(articleDto);
    return data;
  }

  /**
   * 增加文章
   */
  @Post()
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.article.add)
  @Transaction()
  /* 可能出现两张表同时进行操作的情况
    因此开启事务事件：为了让同时进行的表操作要么一起完成，要么都失败
    @Transaction()和 @TransactionManager() manager: EntityManager 是事务的装饰器和对象 */
  async addArticle(
    @Body() articleDto: CreateArticleDto,
    @TransactionManager() manager: EntityManager,
  ) {
    articleDto.title = articleDto.title.trim();
    await this.commitService.addCommit(manager);
    return await this.articleService.addArticle(articleDto, manager);
  }

  /**
   * 更新文章
   */
  @Put('/update')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.article.edit) /* 有已发布能更新的漏洞 */
  @Transaction()
  async updateArticle(
    @Body() articleDto: UpdateArticleDto,
    @TransactionManager() manager: EntityManager,
  ) {
    articleDto.title = articleDto.title.trim();
    await this.commitService.addCommit(manager);
    return await this.articleService.updateArticle(articleDto, manager);
  }

  /**
   * 软删除
   */
  @Put('/delete')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.article.delete)
  @Transaction()
  async removeArticle(
    @Body('id') id: number,
    @TransactionManager() manager: EntityManager,
  ) {
    await this.commitService.addCommit(manager);
    return await this.articleService.removeArticle(id, manager);
  }

  /**
   * 硬删除
   */
  @Delete()
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.article.delete)
  @Transaction()
  async forceRemoveArticle(
    @Body('id') id: number,
    @TransactionManager() manager: EntityManager,
  ) {
    await this.commitService.addCommit(manager);
    return await this.articleService.forceRemoveArticle(+id, manager);
  }

  /**
   * 发表文章
   */
  @Put('/publish')
  @UseGuards(AuthGuard('applySession'))
  @Roles(authConfig.article.publish)
  @Transaction()
  async publishArticle(
    @Body('id') id: number,
    @TransactionManager() manager: EntityManager,
  ) {
    await this.commitService.addCommit(manager);
    return await this.articleService.publishArticle(+id, manager);
  }

  /**
   * 获取文章与留言总数
   */
  @Get('/count')
  @Transaction()
  async getCount(@TransactionManager() manager: EntityManager) {
    return await this.articleService.getCount(manager);
  }
}
