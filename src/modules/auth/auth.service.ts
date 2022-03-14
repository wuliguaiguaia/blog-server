import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { comparePass } from 'src/common/utils/decode';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, // private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证用户
   */
  async validateUser(userDto) {
    console.log('2 验证');
    const { username } = userDto;
    const user = await this.userService.getUserByName(username);
    if (!user) return null;
    if (comparePass(userDto.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user?: any) {
    const { id, role, username } = user;
    return { id, role, username };
  }

  /* async login_jwt(user: any) {
    console.log('3 颁发签证');
    const payload = {
      username: user.username,
      userRole: user.role,
      sub: user.id,
    };
    return {
      // 从用户对象属性的子集生成 jwt，返回一个 access_token 属性
      access_token: this.jwtService.sign(payload),
    };
  } */
}
