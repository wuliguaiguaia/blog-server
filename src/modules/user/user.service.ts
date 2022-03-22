/*
 * service 提供操作数据库服务接口
 */
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
import { encodePass } from 'src/common/utils/decode';

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
    let { password } = userDto;
    password = await encodePass(password);
    return getRepository(UserInfoEntity).save({ ...userDto, password });
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
    let { password } = userDto;
    const data = userDto;
    if (password !== undefined) {
      password = await encodePass(password);
      data.password = password;
    }
    return this.queryBuilder
      .update(UserInfoEntity)
      .set({
        ...data,
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
   * 通过用户名查找用户
   * @param username
   */
  async getUserByName(username: string) {
    return await getRepository(UserInfoEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }
  /**
   * 通过id查找用户
   * @param username
   */
  async getUserById(id: number) {
    return await getRepository(UserInfoEntity)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  /**
   * 查询用户列表
   */
  async getUserList(userDto: QueryUserDto) {
    let whereCondition = '';
    let conditionValues = {};
    const { role } = userDto;

    if (role !== undefined) {
      if (typeof role === 'object') {
        whereCondition = 'user.role in (:role)';
      } else {
        whereCondition = 'user.role = :role';
      }
      conditionValues = { role };
    }
    return await getRepository(UserInfoEntity)
      .createQueryBuilder('user')
      .where(whereCondition, conditionValues)
      .orderBy('user.update_time', 'DESC')
      .skip(userDto.prepage * (userDto.page - 1))
      .take(userDto.prepage && userDto.prepage)
      .getManyAndCount();
  }

  /**
   * 删除指定用户
   */
  async removeUser(id: number) {
    return await getRepository(UserInfoEntity)
      .createQueryBuilder('user')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}

// forFeature UserInfoEntity
// forRootAsync
