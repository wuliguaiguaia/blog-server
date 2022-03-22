/*
 * service 提供操作数据库服务接口
 */
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
  EntityManager,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { ArticleContentEntity } from 'src/entities/article_content.entity';
import { CategoryEntity } from 'src/entities/category.entity';
import getSearchRangText from 'src/common/utils/getSearchRangeText';
import { genId } from 'src/common/utils/genId';
import * as es from './../../common/plugins/es.plugin';
import { ApiException } from './../../common/exceptions/api.exception';

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
  async addArticle(articleDto: CreateArticleDto, manager: EntityManager) {
    const { title, categories, keywords, content } = articleDto;

    /* 分类存储 */
    const realCategories = [];
    if (categories?.length !== 0) {
      for (const id of Object.values(categories)) {
        const one = await manager.findOne(CategoryEntity, {
          id: +id,
        });
        realCategories.push(one);
      }
    }

    const article = new ArticleEntity();
    article.categories = realCategories;
    article.id = genId();
    article.keywords = keywords;
    article.title = title;

    /* 内容存储 */
    const articleContent = new ArticleContentEntity();
    articleContent.content = content;
    article.content = articleContent;
    articleContent.id = genId(); // cascade 自动保存相关对象

    /* mysql save */
    const data = await manager.save(ArticleEntity, article);

    /* es save */
    await es.insert(data);
    return { id: data.id };
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
   * 获取单个文章详情 2.0 es
   * @param query.id 文章id
   */
  async getArticleByIdES(query) {
    const { id } = query;
    const { body } = await es.search({
      body: {
        query: {
          /* constant_score 将 term 查询转化成为过滤器 */
          constant_score: {
            /* 精确值查找 */
            filter: {
              term: {
                id,
              },
            },
          },
        },
      },
    });
    const {
      hits: { total, hits },
    } = body;
    if (total.value === 0) {
      throw new ApiException(404, '文章不存在或已删除');
    }
    return hits[0];
  }

  /**
   * 获取单个文章详情 1.0
   * @param query.id 文章id
   */
  async getArticleById(query) {
    const { id } = query;
    const data = await getConnection()
      .createQueryBuilder(ArticleEntity, 'article')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.content', 'content')
      .where('article.id = :id', { id: +id })
      .getOne();
    if (!data) {
      throw new ApiException(404, '文章不存在或已删除');
    }
    const { categories, content } = data;
    const categoriesMap = categories.map(({ id, name }) => ({ id, name }));
    const contentStr = content.content;
    return {
      ...data,
      categories: categoriesMap,
      content: contentStr,
    };
  }

  /**
   * 根据多个类型查询文章 【已废弃】
   * @param articleDto
   */
  async getArticleByCategory(articleDto) {
    const { categories } = articleDto;
    let articles = await getRepository(CategoryEntity).findByIds(
      categories.map((item) => +item),
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
  async updateArticle(articleDto: UpdateArticleDto, manager) {
    const { title, categories = [], keywords, content, id } = articleDto;
    const article = await manager.findOne(ArticleEntity, {
      relations: ['content'],
      where: {
        id: +id,
        deleted: 0,
      },
    });

    if (!article) {
      throw new ApiException(404, '文章不存在或已删除');
    }

    /* 分类存储 */
    const realCategories = [];
    if (categories?.length !== 0) {
      for (const id of Object.values(categories)) {
        const one = await manager.findOne(CategoryEntity, {
          id: +id,
        });
        realCategories.push(one);
      }
      article.categories = realCategories;
    }
    article.keywords = keywords;
    article.title = title;
    article.content.content = content;

    /* mysql save */
    await manager.save(ArticleEntity, article);

    /* es save */
    await es.update(article);
    return { id: id, updateTime: new Date() };
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
   * 模糊搜索1.0 mysql 原生查询
   */
  async getArticleListFromSearch(articleDto: QueryArticleListDto) {
    const { prepage, page, words = '' } = articleDto;
    if (!words) return [];

    const [list, total] = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.content', 'acontent')
      .select([
        'article.id',
        'article.title',
        'article.updateTime',
        'article.createTime',
        'acontent.content',
      ])
      .where(
        `article.title like "%${words}%" or acontent.content like "%${words}%" and article.deleted = 0`,
      )
      .orderBy(`article.updateTime`, 'DESC')
      .offset(prepage * (page - 1) || 0)
      .limit(prepage && +prepage)
      .getManyAndCount();

    /* 获取目录 map */
    const categoryIdRawMap = await getRepository(CategoryEntity)
      .createQueryBuilder('category')
      .select(['id', 'name'])
      .getRawMany();
    const categoryIdMap = categoryIdRawMap.reduce((res, { id, name }) => {
      res[id] = { id, name };
      return res;
    }, {});

    /* 获取关系 map */
    const ids = list.map((item) => item.id);
    const cateToArti = await getRepository('category_articles_article')
      .createQueryBuilder('caa')
      .select(['categoryId', 'articleId'])
      .where(`articleId in (${ids.join(',')})`)
      .getRawMany();
    const idsMap = cateToArti.reduce((res, item) => {
      const { categoryId, articleId } = item;
      if (!res[articleId]) {
        res[articleId] = [categoryIdMap[categoryId]];
      } else {
        res[articleId].push(categoryIdMap[categoryId]);
      }
      return res;
    }, {});

    list.forEach((item) => {
      const { content, id } = item;
      item.categories = idsMap[id];
      const contentSlice = getSearchRangText(content.content, words);
      delete item.content;
      item.contentSlice = contentSlice;
    });

    return [list, total];
  }

  /**
   * 模糊搜索2.0 es
   */
  async getArticleListFromSearchES(articleDto: QueryArticleListDto) {
    const {
      prepage = 10,
      page = 1,
      words = '',
      columns = ['title', 'content.content'],
      categories = [],
      sorter = '',
      published = null,
    } = articleDto;
    if (!words) return [0, [], { value: 0 }, 0];
    const qbody: any = {
      query: {
        bool: {
          must: [
            {
              match: { deleted: 0 },
            },
          ],
        },
      },
      highlight: {
        pre_tags: ['<span class="highlight">'],
        post_tags: ['</span>'],
        fields: {
          title: {
            fragment_size: 50,
            no_match_size: 50,
          },
          'content.content': {
            fragment_size: 100,
            no_match_size: 100,
          },
        },
      },
    };
    if (published !== null) {
      qbody.query.bool.must.push({
        match: {
          published: +published,
        },
      });
    }
    if (columns?.length) {
      const shoulds = columns.reduce((res, item) => {
        res.push({
          match: {
            [item]: words,
          },
        });
        return res;
      }, []);
      qbody.query.bool.must.push({
        bool: {
          should: shoulds,
        },
      });
    }
    if (
      sorter &&
      JSON.parse(sorter) &&
      Object.keys(JSON.parse(sorter)).length
    ) {
      qbody.sort = [JSON.parse(sorter)];
    }
    if (categories?.length !== 0) {
      const matches = categories.reduce((res, item) => {
        res.push({
          match: {
            'categories.id': item,
          },
        });
        return res;
      }, []);
      qbody.query.bool.must.push({
        bool: {
          should: matches,
        },
      });
    }
    const response = await es.search({
      from: prepage * (page - 1),
      size: prepage,
      body: qbody,
    });
    const {
      took,
      hits: { hits, total, max_score },
    } = response.body;
    return [took, hits, total, max_score];
  }

  /**
   * 查询文章列表 2.0 es
   */
  async getArticleListES(articleDto: QueryArticleListDto, manger) {
    const {
      prepage,
      page,
      type = 0,
      categories = [],
      sorter = '',
      published = null,
    } = articleDto;
    const qbody: any = {
      sort: [
        {
          updateTime: { order: 'DESC' },
        },
      ],
      query: {
        bool: {
          must: [
            {
              match: { deleted: 0 },
            },
          ],
        },
      },
    };

    /* 优化：无条件获取列表 */
    if (
      (!sorter || (sorter && Object.keys(JSON.parse(sorter)).length) === 0) &&
      (!categories || (categories && categories.length === 0)) &&
      published === null
    ) {
      const [list, total] = await getRepository(ArticleEntity)
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.categories', 'category')
        .leftJoinAndSelect('article.content', 'content')
        .where('article.deleted = 0')
        .skip(prepage * (page - 1) || 0)
        .take(prepage && prepage)
        .orderBy({ 'article.updateTime': 'DESC' })
        .getManyAndCount();

      return [
        total,
        list.map((item: any) => {
          const { categories, content } = item;
          item.categories = categories.map((j) => {
            return {
              id: j.id,
              name: j.name,
            };
          });
          item.content = content?.content?.substr(0, 350) || '';
          return item;
        }),
      ];
    }
    if (
      sorter &&
      JSON.parse(sorter) &&
      Object.keys(JSON.parse(sorter)).length
    ) {
      qbody.sort = [JSON.parse(sorter)];
    }

    if (published !== null) {
      qbody.query.bool.must.push({
        match: {
          published: +published,
        },
      });
    }

    if (categories?.length !== 0) {
      const matches = categories.reduce((res, item) => {
        res.push({
          match: {
            'categories.id': item,
          },
        });
        return res;
      }, []);
      qbody.query.bool.must.push({
        bool: {
          [+type === 2 ? 'must' : 'should']: matches,
        },
      });
    }

    const { body } = await es.search({
      from: prepage * (page - 1) || 0,
      size: prepage && prepage,
      body: qbody,
    });
    const {
      took,
      hits: { total, hits },
    } = body;
    return [
      total.value,
      hits.map(({ _source, _source: { categories, content } }) => {
        _source.categories = categories.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });
        _source.content = content.content?.substr(0, 350);
        return _source;
      }),
      took,
    ];
  }

  /**
   * 查询文章列表 1.0
   */
  async getArticleList(articleDto: QueryArticleListDto, manger: EntityManager) {
    const { prepage, page, type = '' } = articleDto;
    const cates = articleDto.categories || [];
    const categories = cates?.map((item) => +item);
    delete articleDto.type;

    const whereCondition = ['deleted = 0'];
    const conditionValues = {};
    for (const key in articleDto) {
      if (!['page', 'prepage', 'categories'].includes(key)) {
        whereCondition.push(`article.${key} = :${key}`);
        conditionValues[key] = articleDto[key];
      }
    }

    if (categories?.length) {
      const qb = await getRepository(ArticleEntity).createQueryBuilder(
        'article',
      );
      switch (+type) {
        case 0:
        case 1 /* 含有指定分类中的某一个 */:
          return await qb
            .where(
              'id IN ' +
                qb
                  .subQuery()
                  .select('articleId')
                  .from('category_articles_article', 'caa')
                  .where('caa.categoryId IN (:category)')
                  .getQuery(),
            )
            .setParameter('category', categories)
            .andWhere(whereCondition.join(' and '), conditionValues)
            .skip(prepage * (page - 1) || 0)
            .take(prepage && prepage)
            .getMany();
        /*
          select * from article where
            id in (select articleId from category_articles_article
              where categoryId in (1,2))
            and title = '我的第一篇blog5'
            and deleted = 0;
        */

        /*
          连表查询
          select distinct a.* from article a
          left join category_articles_article caa on a.id = caa.articleId
          where caa.categoryId in (1,2); 
        */
        case 2 /* 同时含有指定分类, 目前只支持两种 */:
          const qb2 = await getRepository(ArticleEntity).createQueryBuilder();
          const categoryWhereStr = () => {
            const result = categories.reduce((res, item, index) => {
              const data = `c${index + 1}.categoryId = ${item}`;
              res.push(data);
              return res;
            }, []);
            return result.join(' and ');
          };

          return await qb
            .where(
              'id IN ' +
                qb2
                  .subQuery()
                  .select('c1.articleId') // 联表查询有相同字段必须指定表名： Column 'articleId' in field list is ambiguous"
                  .from('category_articles_article', 'c1')
                  .innerJoin('category_articles_article', 'c2')
                  .where('c1.articleId = c2.articleId')
                  .andWhere(categoryWhereStr()) //'c1.categoryId = 1 and c2.categoryId = 2'
                  .getQuery(),
            )
            .andWhere(whereCondition.join(' and '), conditionValues)
            .orderBy(`article.updateTime`, 'DESC')
            .skip(prepage * (page - 1) || 0)
            .take(prepage && prepage)
            .getMany();
        /* 
            select distinct c1.articleId from category_articles_article c1
            left join category_articles_article c2
            on c1.articleId = c2.articleId
            where c1.categoryId = 1 and c2.categoryId = 2;
          */
      }
    }

    return await manger.find(ArticleEntity, {
      take: prepage && prepage,
      skip: prepage * (page - 1) || 0,
      order: {
        updateTime: 1,
      },
      where: conditionValues,
    });
  }

  /**
   * 软删除指定文章
   */
  async removeArticle(id: number, manager: EntityManager) {
    await manager.update(ArticleEntity, id, { deleted: 1 });
    await es.update({ id, deleted: 1 });
    return null;
  }

  /**
   * 硬删除
   */
  async forceRemoveArticle(id: number, manager: EntityManager) {
    await manager.delete(ArticleEntity, id);
    await es.remove({ id });
    return null;
  }

  /**
   * 发表文章
   */
  async publishArticle(id: number, manager: EntityManager) {
    await manager.update(ArticleEntity, id, { published: 1 });
    await es.update({ id, published: 1 });
    return null;
  }

  /**
   * 获取文章与留言总数
   */
  async getCount(manager: EntityManager) {
    const articleLen = await manager.count(ArticleEntity);
    const messageLen = await manager.count(MessageEntity);
    const CommentLen = await manager.count(CommentEntity);
    return {
      articleLen,
      messageLen: messageLen + CommentLen,
    };
  }
}
