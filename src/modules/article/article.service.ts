import { CategoryEntity } from 'src/entities/category.entity';
/*
 * service 提供操作数据库服务接口
 */
import { ArticleEntity } from './../../entities/article.entity';
import {
  CreateArticleDto,
  UpdateArticleDto,
  QueryArticleListDto,
} from './dto/article.dto';
import {
  EntityRepository,
  Repository,
  SelectQueryBuilder,
  getConnection,
  getRepository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { listeners } from 'process';

@EntityRepository(ArticleEntity)
export class ArticleService {
  private readonly queryBuilder: SelectQueryBuilder<any> = null;

  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleInfoRepository: Repository<ArticleEntity>,
  ) {
    this.queryBuilder = getConnection().createQueryBuilder();
  }

  /**
   * 增加文章
   * @param articleDto
   */
  async addArticle(articleDto: CreateArticleDto, manager) {
    const list = await this.getArticleByCondition({
      condition: 'title = :title', // and or
      values: { title: articleDto.title },
    });
    if (list.length > 0) {
      throw new Error('文章名不能重复');
    }

    const categories = [];
    if (articleDto.categories?.length !== 0) {
      for (const id of Object.values(articleDto.categories)) {
        const one = await manager.findOne(CategoryEntity, {
          id: +id,
        });
        categories.push(one);
      }
    }
    articleDto.categories = categories;
    return await manager.save(ArticleEntity, articleDto);
  }

  /**
   * 条件查询文章
   * @param whereCondition
   */
  getArticleByCondition(whereCondition: any) {
    const { condition, values } = whereCondition;
    return getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .where(condition, values)
      .getMany();
  }

  /* 
    获取单个文章详情
  */
  async getArticleById(query) {
    const list = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      // .leftJoinAndSelect('question.categories', 'category')
      .where('article.id = :id', { id: query.id })
      .getOne();
    return list;
  }

  /**
   * 根据类型查询文章
   * @param whereCondition
   */
  async getArticleByCategory(category: number) {
    const a = await getConnection()
      .createQueryBuilder()
      .relation(ArticleEntity, 'categories')
      .of(1) // 也可以使用post id
      .loadMany();

    return await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .where('category = :category', { category: +category })
      .getMany();
  }

  /**
   * 更新文章
   */
  async updateArticle(articleDto: UpdateArticleDto) {
    const list = await this.getArticleByCondition({
      condition: 'title = :title and id != :id',
      values: { title: articleDto.title, id: articleDto.id },
    });
    if (list.length) {
      throw new Error('文章名重复');
    }

    return await this.queryBuilder
      .update(ArticleEntity)
      .set({
        ...articleDto,
      })
      .where('id = :id', { id: articleDto.id })
      .execute();
  }

  /**
   * 通过手机号查找文章
   * @param mobile
   */
  async getArticleByMobile(mobile: string) {
    return await this.getArticleByCondition({
      condition: 'mobile = :mobile',
      value: { mobile },
    })?.[0];
  }

  /**
   * 查询文章列表
   */
  async getArticleList(articleDto: QueryArticleListDto) {
    const whereCondition = [];
    const conditionValues = {};
    for (const key in articleDto) {
      if (!['page', 'prepage'].includes(key)) {
        whereCondition.push(`article.${key} = :${key}`);
        conditionValues[key] = articleDto[key];
      }
    }

    if (articleDto.category) {
      return await this.getArticleByCategory(articleDto.category);
    }

    return await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .where(whereCondition.join(' and '), conditionValues)
      .orderBy('article.update_time', 'DESC') // ASC
      .take(articleDto.prepage && articleDto.prepage)
      .skip(articleDto.prepage * (articleDto.page - 1) || 0)
      .getManyAndCount();
  }

  /**
   * 删除指定文章
   */
  async removeArticle(id: number) {
    return await this.queryBuilder
      .delete()
      .from(ArticleEntity, 'article')
      .where('id = :id', { id })
      .execute();
  }
}
