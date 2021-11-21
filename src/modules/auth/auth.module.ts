import { UserModule } from './../user/user.module';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { MyLogger } from '../../common/utils/logger.service';
// import { MyLogger } from '../../../src//common/utils/logger.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
