import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleAnalysis } from './entities/article-analysis.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Article, ArticleAnalysis, UserEntity])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule { }
