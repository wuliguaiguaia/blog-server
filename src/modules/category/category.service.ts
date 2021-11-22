/*
 * 分类服务
 */

import { ApiErrorCode } from './../../common/exceptions/api.code.enum';
import { ApiException } from './../../common/exceptions/api.exception';
import { CategoryEntity } from './../../entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  QueryCategoryDto,
} from './dto/category.dto';
import {
  EntityRepository,
  Repository,
  SelectQueryBuilder,
  getConnection,
  getRepository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
      throw new Error('分类名重复');
      // throw new ApiException(
      //   ApiErrorCode.TABLE_OPERATE_ERROR,
      //   '分类手机号不能重复',
      // );
    }

    return await this.queryBuilder
      .update(CategoryEntity)
      .set({
        ...categoryDto,
      })
      .where('id = :id', { id: categoryDto.id })
      .execute();
  }

  /**
   * 查询分类列表
   */
  async getCategoryList() {
    const response = await getRepository(CategoryEntity).find({
      relations: ['articles'],
    });
    return [
      response.map((item) => {
        item.articlesLen = item.articles.length;
        delete item.articles;
        return item;
      }),
      response.length,
    ];
  }

  /**
   * 删除指定分类
   */
  async removeCategory(id: number) {
    return await this.queryBuilder
      .delete()
      .from(CategoryEntity, 'category')
      .where('category.id = :id', { id })
      .execute();
  }
}
