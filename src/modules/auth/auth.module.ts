import { LocalStrategy } from './local.strategy';
import { UserModule } from './../user/user.module';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      // 通过导入 JWT 签名时使用的相同密钥，我们可以
      // 确保 Passport 执行的验证阶段和 AuthService 执行的签名阶段使用公共密钥。
      secret: config.jwtSecret,
      signOptions: { expiresIn: '2592000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}
