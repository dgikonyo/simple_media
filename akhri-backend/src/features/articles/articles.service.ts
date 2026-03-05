import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { ArticleAnalysis } from './entities/article-analysis.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  constructor(private dataSource: DataSource,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>) { }

  async create(createArticleDto: CreateArticleDto, bloggerId: string,): Promise<Article> {
    const startTime = Date.now();
    this.logger.log(`Creating article: title="${createArticleDto}", bloggerId="${bloggerId}"`);

    // 1. Start a Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.debug(`Transaction started for article: ${JSON.stringify(createArticleDto)}`);
      // 2. Prepare the Article
      const { analysisData, summarisedStory, ...articleData } =
        createArticleDto;

      const newArticle = new Article();
      Object.assign(newArticle, articleData);

      // newArticle.blogger = { id: bloggerId } as UserEntity;
      const blogger = await this.usersRepository.findOne({
        where: { id: bloggerId }
      })

      if (!blogger) {
        this.logger.warn(`Article creation blocked: user not found id=${bloggerId}`);
        throw new NotFoundException('User not found in database');
      }

      newArticle.blogger = blogger;

      const savedArticle = await queryRunner.manager.save(newArticle);
      this.logger.log(`Article saved with id: ${savedArticle.id}`);

      if (analysisData || summarisedStory) {
        const analysis = new ArticleAnalysis();
        analysis.article = savedArticle; // Link the relationship
        analysis.differencesData = analysisData || {};
        analysis.summarisedStory = summarisedStory;

        await queryRunner.manager.save(analysis);

        savedArticle.analysis = analysis;
        this.logger.debug(`Analysis saved for article id: ${savedArticle.id}`);
      }

      // 5. Commit Transaction
      await queryRunner.commitTransaction();

      const duration = Date.now() - startTime;
      this.logger.log(`Article created successfully: id=${savedArticle.id}, duration=${duration}ms`);


      return savedArticle;
    } catch (err: any) {
      // 6. Rollback if anything fails
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Failed to create article: title="${createArticleDto}", bloggerId="${bloggerId}"`,
        err.stack,
      );

      throw new InternalServerErrorException(
        'Article creation failed. Database reverted.',
      );
    } finally {
      // 7. Release connection
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Article[]> {
    const startTime = Date.now();
    this.logger.log('Fetching all articles with blogger relations');

    try {
      const articles = await this.dataSource.getRepository(Article).find({
        relations: ['blogger'],
        order: { createdAt: 'DESC' },
      });

      const duration = Date.now() - startTime;
      this.logger.log(`Successfully retrieved ${articles.length} articles in ${duration}ms`);

      return articles;
    } catch (err: any) {
      this.logger.error(
        'Failed to retrieve articles from database',
        err.stack,
      );

      throw new InternalServerErrorException('Could not fetch articles. Please try again later.');
    }
  }

  async fetchArticleBySlug(slug: string): Promise<Article> {
    const startTime = Date.now();
    this.logger.log(`Fetching article: slug="${slug}"`);

    try {
      const articleData = await this.articleRepository.findOneBy({ slug });

      if (!articleData) {
        this.logger.warn(`Article fetch failed: slug="${slug}" not found`);
        throw new NotFoundException(`Article with slug "${slug}" not found`);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Article retrieved successfully: slug="${slug}", duration=${duration}ms`);

      return articleData;
    } catch (err: any) {
      // If it's already a NotFoundException, just rethrow it so it doesn't get logged as a 500 error
      if (err instanceof NotFoundException) {
        throw err;
      }

      this.logger.error(
        `Failed to fetch article: slug="${slug}"`,
        err.stack,
      );

      throw new InternalServerErrorException(
        'An error occurred while retrieving the article.',
      );
    }
  }
}
