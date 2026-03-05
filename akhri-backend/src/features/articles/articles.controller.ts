import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Logger,
  Param,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Article } from './entities/article.entity';
import { ArticleResponse } from './dto/article-response.dto';

function toArticleResponse(article: Article): ArticleResponse {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    body: article.body,
    excerpt: article.excerpt ?? null,
    imageUrl: article.imageUrl ?? null,
    status: article.status,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    blogger: article.blogger
      ? {
        id: article.blogger.id,
        firstName: article.blogger.firstName,
        lastName: article.blogger.lastName,
        email: article.blogger.email,
      }
      : null,
    analysis: article.analysis
      ? {
        id: article.analysis.id,
        summarisedStory: article.analysis.summarisedStory ?? null,
        differencesData: article.analysis.differencesData ?? {},
      }
      : null,
  };
}

@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);
  constructor(private readonly articlesService: ArticlesService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  /* The `async create(@Body() createArticleDto: CreateArticleDto, @Request() req):
  Promise<ArticleResponse>` method in the `ArticlesController` class is a controller method that
  handles the creation of a new article. Here's a breakdown of what it does: */
  async create(@Body() createArticleDto: CreateArticleDto, @Request() req): Promise<ArticleResponse> {
    this.logger.debug(`Create article request from user: ${req.user.id}`);
    const article: Article = await this.articlesService.create(createArticleDto, req.user.id);

    return toArticleResponse(article);
  }

  @Get()
  /* The `async findAll(): Promise<ArticleResponse[]>` method in the `ArticlesController` class is a
  controller method that retrieves all articles from the database. Here's a breakdown of what it
  does: */
  async findAll(): Promise<ArticleResponse[]> {
    const articles: Article[] = await this.articlesService.findAll();
    return articles.map(toArticleResponse);
  }

  @Get(':slug')
  async fetchArticleBySlug(@Param('slug') slug: string): Promise<ArticleResponse> {
    const articleData: Article = await this.articlesService.fetchArticleBySlug(slug);
    return toArticleResponse(articleData);
  }
}
