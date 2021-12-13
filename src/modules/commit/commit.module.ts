import { CommitEntity } from '../../entities/commit.entity';
import { CommitService } from './commit.service';
import { Module } from '@nestjs/common';
import { CommitController } from './commit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CommitEntity])],
  controllers: [CommitController],
  providers: [CommitService],
  exports: [CommitService],
})
export class CommitModule {}
