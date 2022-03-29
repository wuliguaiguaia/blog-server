/*
 * 分类服务
 */

import { ApiErrorCode } from './../../common/exceptions/api.code.enum';
import { ApiException } from './../../common/exceptions/api.exception';
import { CategoryEntity } from './../../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  EntityRepository,
  Repository,
  SelectQueryBuilder,
  getConnection,
  getRepository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as es from '../../common/plugins/es.plugin';
@EntityRepository(CategoryEntity)
export class CategoryService {
  private readonly queryBuilder: SelectQueryBuilder<any> = null;

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    this.queryBuilder = getConnection().createQueryBuilder();
  }

  /**
   * 增加分类
   * @param categoryDto
   */
  async addCategory(categoryDto: CreateCategoryDto) {
    const list = await this.getCategoryByCondition({
      condition: 'name = :name',
      values: { name: categoryDto.name },
    });
    if (list.length > 0) {
      throw new ApiException(
        ApiErrorCode.TABLE_OPERATE_ERROR,
        '分类名不能重复',
      );
    }
    return await this.queryBuilder
      .insert()
      .into(CategoryEntity)
      .values({
        ...categoryDto,
        createTime: Date.now(),
        updateTime: Date.now(),
      })
      .execute();
  }

  /**
   * 条件查询分类
   * @param whereCondition
   */
  getCategoryByCondition(whereCondition: any) {
    const { condition, values } = whereCondition;
    return getRepository(CategoryEntity)
      .createQueryBuilder('category')
      .where(condition, values)
      .getMany();
  }

  /**
   * 更新分类
   */
  async updateCategory(categoryDto: UpdateCategoryDto) {
    const list = await this.getCategoryByCondition({
      condition: 'name = :name and id != :id',
      values: { name: categoryDto.name, id: categoryDto.id },
    });
    if (list.length) {
      throw new ApiException(ApiErrorCode.CATEGORY_REPEAT);
    }

    return await this.queryBuilder
      .update(CategoryEntity)
      .set({
        ...categoryDto,
        updateTime: Date.now(),
      })
      .where('id = :id', { id: categoryDto.id })
      .execute();
  }

  /**
   * 查询分类列表及其包含数量 1.0
   */
  async getCategoryList() {
    const response = await getRepository(CategoryEntity).find({
      relations: ['articles'],
    });
    return response;
  }

  /**
   * 查询分类列表及其包含数量 2.0 es
   * 需要做速度测试：took：花费了多少秒
   */

  async getCategoryListES() {
    const { body } = await es.search({
      from: 0,
      size: 100,
      body: {
        aggs: {
          categories: {
            terms: { field: 'categories.id' },
          },
        },
      },
    });
    // 得到针对某个分类id的个数
    const {
      categories: { buckets },
    } = body.aggregations;
    return [buckets, 10];
  }

  /**
   * 删除指定分类
   */
  async removeCategory(id: number, manager) {
    await manager.delete(CategoryEntity, id);
    return null;
  }
}
