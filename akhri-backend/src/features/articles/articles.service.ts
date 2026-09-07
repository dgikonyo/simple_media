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
import { ArticlesAnalysisService } from '../articles-analysis/articles-analysis.service';
import { AnalysisResult } from './dto/article-response.dto';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  constructor(private dataSource: DataSource,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    private readonly analysisService: ArticlesAnalysisService) { }

  async create(createArticleDto: CreateArticleDto, bloggerId: string): Promise<Article> {
    const startTime = Date.now();
    this.logger.log(`Creating article: title="${createArticleDto.title}", bloggerId="${bloggerId}"`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const blogger = await this.usersRepository.findOne({
        where: { id: bloggerId },
      });

      if (!blogger) {
        this.logger.warn(`Article creation blocked: user not found id=${bloggerId}`);
        throw new NotFoundException('User not found in database');
      }

      this.logger.debug(`Transaction started for article: ${createArticleDto.title}`);

      const { analysisData, summarisedStory, ...articleData } = createArticleDto;
      let aiAnalysis: AnalysisResult | null = null;

      try {
        aiAnalysis = await this.analysisService.analyzeArticle(articleData.title, articleData.body);
        this.logger.debug(`AI analysis generated for article: ${articleData.title}`);
      } catch (error: any) {
        this.logger.error(`AI analysis failed: ${error.message}`, error.stack);
      }

      const newArticle = new Article();
      Object.assign(newArticle, articleData);
      newArticle.blogger = blogger;

      // Map AI Analysis properties directly onto the Article based on the new schema
      if (aiAnalysis) {
        newArticle.excerpt = aiAnalysis.excerpt;
        newArticle.summarisedStory = aiAnalysis.summarisedStory;
        newArticle.sentiment = aiAnalysis.analysisData.sentiment;
        newArticle.keywords = aiAnalysis.analysisData.keywords;
        newArticle.wordCount = aiAnalysis.analysisData.wordCount;
        newArticle.readingTimeMinutes = aiAnalysis.analysisData.readingTimeMinutes;
        newArticle.analysisGeneratedAt = new Date(aiAnalysis.analysisData.generatedAt);
      } else {
        newArticle.excerpt = createArticleDto.excerpt || undefined;
      }

      // Initialize the ArticleAnalysis table for storing differences/history
      const analysis = new ArticleAnalysis();
      analysis.summarisedStory = aiAnalysis?.summarisedStory || summarisedStory;
      analysis.differencesData = analysisData || {};

      // Because `cascade: true` is set, assigning this will save both at once
      newArticle.analysis = analysis;

      const savedArticle = await queryRunner.manager.save(newArticle);
      this.logger.log(`Article saved with id: ${savedArticle.id}`);

      await queryRunner.commitTransaction();
      const duration = Date.now() - startTime;
      this.logger.log(`Article created successfully: id=${savedArticle.id}, duration=${duration}ms`);

      return savedArticle;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to create article: title="${createArticleDto.title}", bloggerId="${bloggerId}"`,
        err.stack,
      );
      throw new InternalServerErrorException('Article creation failed. Database reverted.');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Article[]> {
    const startTime = Date.now();
    this.logger.log('Fetching all articles');

    try {
      const articles = await this.articleRepository.find({
        order: { createdAt: 'DESC' },
      });

      const duration = Date.now() - startTime;
      this.logger.log(`Successfully retrieved ${articles.length} articles in ${duration}ms`);

      return articles;
    } catch (err: any) {
      this.logger.error('Failed to retrieve articles from database', err.stack);
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
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`Failed to fetch article: slug="${slug}"`, err.stack);
      throw new InternalServerErrorException('An error occurred while retrieving the article.');
    }
  }
}
