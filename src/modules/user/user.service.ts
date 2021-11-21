import { ApiErrorCode } from './../../common/exceptions/api.code.enum';
import { ApiException } from './../../common/exceptions/api.exception';
/*
 * service 提供操作数据库服务接口
 */
// import { ArticleService } from './../article/article.service';
import { UserInfoEntity } from './../../entities/user.entity';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto/user.dto';
import {
  EntityRepository,
  Repository,
  SelectQueryBuilder,
  getConnection,
  getRepository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(UserInfoEntity)
export class UserService {
  private readonly queryBuilder: SelectQueryBuilder<any> = null;

  constructor(
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
  ) {
    this.queryBuilder = getConnection().createQueryBuilder();
  }

  /**
   * 增加用户
   * @param userDto
   */
  async addUser(userDto: CreateUserDto) {
    const list = await this.getUserByCondition({
      condition: 'mobile = :mobile', // and or
      // .where("user.name IN (:...names)", { names: [ "Timber", "Cristal", "Lina" ] })
      values: { mobile: userDto.mobile },
    });
    if (list.length > 0) {
      throw new ApiException(
        ApiErrorCode.TABLE_OPERATE_ERROR,
        '用户手机号不能重复',
      );
    }
    return await this.queryBuilder
      .insert()
      .into(UserInfoEntity)
      .values({
        ...userDto,
      })
      .execute();
    // return await this.userInfoRepository.save(userDto);
  }

  /**
   * 条件查询用户
   * @param whereCondition
   */
  getUserByCondition(whereCondition: any) {
    const { condition, values } = whereCondition;
    return getRepository(UserInfoEntity)
      .createQueryBuilder('user')
      .where(condition, values)
      .getMany();
  }

  /**
   * 更新用户
   */
  async updateUser(userDto: UpdateUserDto) {
    const list = await this.getUserByCondition({
      condition: 'mobile = :mobile and id != :id',
      values: { mobile: userDto.mobile, id: userDto.id },
    });
    if (list.length) {
      throw new Error('用户手机号名重复');
      // throw new ApiException(
      //   ApiErrorCode.TABLE_OPERATE_ERROR,
      //   '用户手机号不能重复',
      // );
    }

    return await this.queryBuilder
      .update(UserInfoEntity)
      .set({
        ...userDto,
      })
      .where('id = :id', { id: userDto.id })
      .execute();
  }

  /**
   * 通过手机号查找用户
   * @param mobile
   */
  async getUserByMobile(mobile: string) {
    return await this.getUserByCondition({
      condition: 'mobile = :mobile',
      values: { mobile },
    });
  }

  /**
   * 查询用户列表
   */
  async getUserList(userDto: QueryUserDto) {
    const whereCondition = [];
    const conditionValues = {};
    for (const key in userDto) {
      if (!['page', 'prepage'].includes(key)) {
        whereCondition.push(`user.${key} = :${key}`);
        conditionValues[key] = userDto[key];
      }
    }

    return await getRepository(UserInfoEntity)
      .createQueryBuilder('user')
      .where(whereCondition.join(' and '), conditionValues)
      .orderBy('user.update_time', 'DESC') // ASC
      .take(userDto.prepage && userDto.prepage)
      .skip(userDto.prepage * (userDto.page - 1) || 0)
      .getManyAndCount();
  }

  /**
   * 删除指定用户
   */
  async removeUser(id: number) {
    return await this.queryBuilder
      .delete()
      .from(UserInfoEntity)
      .where('id = :id', { id })
      .execute();
  }
}

// forFeature UserInfoEntity
// forRootAsync
