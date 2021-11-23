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

  /**
   * 获取单个文章详情
   * @param query.id 文章id
   */
  async getArticleById(query) {
    const { id } = query;
    const categories = await getConnection()
      .createQueryBuilder()
      .relation(ArticleEntity, 'categories')
      .of(id)
      .loadMany();
    const data = await getConnection()
      .createQueryBuilder()
      .select('article')
      .from(ArticleEntity, 'article')
      .where('article.id = :id', { id: +query.id })
      .getOne();
    data.categories = categories;
    return data;
  }

  /**
   * 根据多个类型查询文章
   * @param articleDto
   */
  async getArticleByCategory(articleDto) {
    let articles = await getRepository(CategoryEntity).findByIds(
      articleDto.categories.map((item) => +item),
      {
        relations: ['articles'],
      },
    );
    const set = new Set();
    articles = articles
      .reduce((res, item) => {
        const { articles } = item;
        articles.forEach((item) => {
          if (!set.has(item.id)) {
            res.push(item);
          }
          set.add(item.id);
        });
        return res;
      }, [])
      .sort(
        (item1, item2) =>
          new Date(item2.createTime).getTime() -
          new Date(item1.createTime).getTime(),
      );
    const count = articles.length;
    const list = articles.splice(
      articleDto.prepage * (articleDto.page - 1) || 0,
      articleDto.prepage ? +articleDto.prepage : count,
    );
    return [list, count];
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
        // ...articleDto,
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
    if (articleDto.categories?.length) {
      return await this.getArticleByCategory(articleDto);
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
