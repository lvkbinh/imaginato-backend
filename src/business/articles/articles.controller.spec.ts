import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesMockService } from './articles.mock.service';
import { CommentsService } from '../comments/comments.service';
import { CommentsMockService } from '../comments/comments.mock.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as faker from 'faker';
import { Article } from '../articles/article.entity';
import { Comment } from '../comments/comment.entity';

const initArticle = () => {
  const article = new Article();
  article.id = parseInt(faker.random.number());
  article.title = faker.name.title();
  article.nickname = faker.internet.userName();
  article.content = faker.random.words();
  article.createdAt = new Date();
  article.updatedAt = article.createdAt;
  return article;
};

const initComment = () => {
  const comment = new Comment();
  comment.id = parseInt(faker.random.number());
  comment.nickname = faker.internet.userName();
  comment.content = faker.random.words();
  comment.createdAt = new Date();
  comment.updatedAt = comment.createdAt;
  return comment;
};

describe('Articles controller', () => {
  let commentsService: CommentsService;
  let articlesService: ArticlesService;
  let articlesController: ArticlesController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        { provide: CommentsService, useClass: CommentsMockService },
        { provide: ArticlesService, useClass: ArticlesMockService }
      ]
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    articlesService = module.get<ArticlesService>(ArticlesService);
    articlesController = module.get<ArticlesController>(ArticlesController);
  });

  it('Should be defined', () => {
    expect(commentsService).toBeDefined();
    expect(articlesService).toBeDefined();
    expect(articlesController).toBeDefined();
  });

  describe('create function', () => {
    it('Should successfully create an article', async () => {
      const article = initArticle();

      jest
        .spyOn(articlesService, 'create')
        .mockResolvedValueOnce(article);

      const result = await articlesController.create({
        title: article.title,
        nickname: article.nickname,
        content: article.content
      });

      expect(result).toBe(article);
    });
  });

  describe('get function', () => {
    it('Should successfully found list of articles', async () => {
      const article1 = initArticle();
      const article2 = initArticle();
      const articles = [article1, article2];

      jest
        .spyOn(articlesService, 'fetchAll')
        .mockResolvedValueOnce(articles);

      const result = await articlesController.get({
        take: 20,
        skip: 0,
        sort: 'id:desc'
      });

      expect(result).toBe(articles);
    });
  });

  describe('getArticleContent function', () => {
    it('Should throw error when not found article', async () => {
      jest
        .spyOn(articlesService, 'findOneOrThrowError')
        .mockRejectedValueOnce(new NotFoundException());

      let error;

      try {
        await articlesController.getArticleContent(1);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('Should return content of an article', async () => {
      const article = initArticle();

      jest
        .spyOn(articlesService, 'findOneOrThrowError')
        .mockResolvedValueOnce(article);

      const result = await articlesController.getArticleContent(1);
      
      expect(result).toBe(article.content);
    });
  });

  describe('addCommentToArticle function', () => {
    it('Should throw error when not found article', async () => {
      jest
        .spyOn(articlesService, 'findOneOrThrowError')
        .mockRejectedValueOnce(new NotFoundException());

      let error;

      try {
        await articlesController.addCommentToArticle(1, {
          nickname: '',
          content: ''
        });
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('Should successfully add comment to an article', async () => {
      const article = initArticle();
      const comment = initComment();
      comment.article = article;

      jest
        .spyOn(articlesService, 'findOneOrThrowError')
        .mockResolvedValueOnce(article);

      jest
        .spyOn(commentsService, 'create')
        .mockResolvedValueOnce(comment);

      const result = await articlesController.addCommentToArticle(article.id, {
        nickname: comment.nickname,
        content: comment.content
      });

      expect(result).toBe(comment);
    });
  });

  describe('getArticleComments function', () => {
    it('Should throw error when not found an article', async () => {
      jest
        .spyOn(articlesService, 'findOneOrThrowError')
        .mockRejectedValueOnce(new NotFoundException());

      jest
        .spyOn(commentsService, 'fetchFullCommentsOfArticle')
        .mockResolvedValueOnce([]);

      let error;

      try {
        await articlesController.getArticleComments(1);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('Should successfully found comments of articles', async () => {
      const article = initArticle();

      const comment1 = initComment();
      comment1.article = article;

      const comment2 = initComment();
      comment2.article = article;

      const comments = [comment1, comment2];

      jest
        .spyOn(articlesService, 'findOneOrThrowError')
        .mockResolvedValueOnce(article);

      jest
        .spyOn(commentsService, 'fetchFullCommentsOfArticle')
        .mockResolvedValueOnce(comments);

      const result = await articlesController.getArticleComments(article.id);

      expect(result).toBe(comments);
    });
  });
});