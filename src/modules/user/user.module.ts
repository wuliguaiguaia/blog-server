// import { ArticleModule } from './../article/article.module';
import { UserInfoEntity } from './../../entities/user.entity';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfoEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
