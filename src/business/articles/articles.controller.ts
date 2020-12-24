import { Body, Controller, Param, Post, Get, Query, InternalServerErrorException } from '@nestjs/common';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDTO } from './dto/create-article.dto';
import { GetArticlesDTO } from './dto/get-articles.dto';
import { CreateCommentDTO } from '../comments/dto/create-comment.dto';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/comment.entity';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(
    private articlesService: ArticlesService,
    private commentsService: CommentsService
  ) {}

  @ApiCreatedResponse({ type: Article })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error happened' })
  @Post()
  async create(
    @Body() reqBody: CreateArticleDTO
  ): Promise<Article> {
    try {
      const articles = await this.articlesService.create(reqBody);

      return articles;

    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @ApiOkResponse({ type: [Article] })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error happened' })
  @Get()
  async get(
    @Query() reqQuery: GetArticlesDTO
  ): Promise<Article[]> {
    try {
      const defaultFilter = {
        skip: 0,
        take: 20,
        sort: 'createdAt:desc'
      };

      const filters = {
        ...defaultFilter,
        ...reqQuery
      };

      const articles = await this.articlesService.fetchAll(filters);

      return articles;

    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @ApiOkResponse({ type: String })
  @ApiNotFoundResponse({ description: 'Not found article' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error happened' })
  @Get(':id/content')
  async getArticleContent(
    @Param('id') id: number
  ): Promise<string> {
    try {
      const article = await this.articlesService.findOneOrThrowError(id);

      return article.content;

    } catch (e) {
      if (e.status) {
        throw e;
      }
      console.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @ApiCreatedResponse({ type: Comment })
  @ApiNotFoundResponse({ description: 'Not found article' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error happened' })
  @Post(':id/comments')
  async addCommentToArticle(
    @Param('id') id: number,
    @Body() reqBody: CreateCommentDTO
  ): Promise<Comment> {
    try {
      const article = await this.articlesService.findOneOrThrowError(id);

      const comment = await this.commentsService.create(
        reqBody,
        { article }
      );

      return comment;

    } catch (e) {
      if (e.status) {
        throw e;
      }
      console.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @ApiOkResponse({ type: Comment })
  @ApiNotFoundResponse({ description: 'Not found article' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error happened' })
  @Get(':id/comments')
  async getArticleComments(
    @Param('id') id: number
  ): Promise<Comment[]> {
    try {
      const [comments] = await Promise.all([
        this.commentsService.fetchFullCommentsOfArticle(id),
        this.articlesService.findOneOrThrowError(id)
      ]);

      return comments;

    } catch (e) {
      if (e.status) {
        throw e;
      }
      console.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}