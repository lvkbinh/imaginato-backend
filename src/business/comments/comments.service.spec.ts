import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../articles/article.entity';
import { Comment } from './comment.entity';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import * as typeorm from 'typeorm';

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

describe('Comments service', () => {
  let commentsService: CommentsService;
  let commentsRepository: Repository<Comment>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useClass: Repository }
      ]
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('Service should be defined', () => {
    expect(commentsService).toBeDefined();
  });

  describe('create function', () => {
    it('Should successfully created a comment for article', async () => {
      const article = initArticle();
      const comment = initComment();
      comment.article = article;
  
      jest
        .spyOn(commentsRepository, 'save')
        .mockResolvedValueOnce(comment);
  
      const result = await commentsService.create({
        nickname: comment.nickname,
        content: comment.content
      }, {
        article
      });
  
      expect(result).toBe(comment);
    });

    it('Should successfully created a comment for comment', async () => {
      const article = initArticle();
      const parent = initComment();
      parent.article = article;
      const comment = initComment();
      comment.article = article;
      comment.parent = parent;
  
      jest
        .spyOn(commentsRepository, 'save')
        .mockResolvedValueOnce(comment);
  
      const result = await commentsService.create({
        nickname: comment.nickname,
        content: comment.content
      }, {
        parent
      });
  
      expect(result).toBe(comment);
    });
  });

  describe('fetchDescendantsOfComment function', () => {
    it('Should successfully found list of children comments', async () => {
      const article = initArticle();

      const parent = initComment();
      parent.article = article;

      const comment1 = initComment();
      comment1.parent = parent;
      comment1.article = article;
  
      const comment2 = initComment();
      comment1.parent = parent;
      comment1.article = article;

      const comments = [comment1, comment2];

      (typeorm as any).getManager = jest.fn().mockImplementation(() => ({
        getTreeRepository: jest.fn().mockImplementation(() => ({
          findDescendantsTree: jest.fn().mockResolvedValueOnce({
            ...parent,
            children: comments,
          })
        }))
      }));

      jest
        .spyOn(commentsRepository, 'findOneOrFail')
        .mockResolvedValueOnce(parent);
  
      const result = await commentsService.fetchDescendantsOfComment(parent.id);

      expect(result).toBe(comments);
    });

    it('Should throw error when not found parent comment', async () => {
      jest
        .spyOn(commentsService, 'findOneOrThrowError')
        .mockRejectedValueOnce(new NotFoundException());
  
      let error;

      try {
        await commentsService.fetchDescendantsOfComment(1);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('fetchFullCommentsOfArticle function', () => {
    it('Should successfully found list of children comments', async () => {
      const article = initArticle();

      const comment1 = initComment();
      comment1.article = article;
  
      const comment2 = initComment();
      comment1.article = article;

      const comments = [comment1, comment2];

      jest
        .spyOn(commentsService, 'fetchDescendantsOfComment')
        .mockResolvedValueOnce(comments);

      const result = await commentsService.fetchDescendantsOfComment(article.id);

      expect(result).toBe(comments);
    });

    it('Should throw error when not found parent comment', async () => {
      jest
        .spyOn(commentsService, 'findOneOrThrowError')
        .mockRejectedValueOnce(new NotFoundException());
  
      let error;

      try {
        await commentsService.fetchFullCommentsOfArticle(1);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeInstanceOf(TypeError);
      }
    });
  });
});