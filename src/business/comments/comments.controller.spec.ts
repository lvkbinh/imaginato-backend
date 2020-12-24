import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsMockService } from './comments.mock.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as faker from 'faker';
import { Article } from '../articles/article.entity';
import { Comment } from './comment.entity';

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

describe('Comments controller', () => {
  let commentsService: CommentsService;
  let commentsController: CommentsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useClass: CommentsMockService }
      ]
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentsController = module.get<CommentsController>(CommentsController);
  });

  it('Should be defined', () => {
    expect(commentsService).toBeDefined();
    expect(commentsController).toBeDefined();
  });

  describe('create function', () => {
    it('Should throw error when not found parent comment', async () => {
      jest
        .spyOn(commentsService, 'findOneOrThrowError')
        .mockRejectedValueOnce(new NotFoundException());

      let error;

      try {
        await commentsController.create({
          nickname: faker.internet.userName(),
          content: faker.random.words()
        },
          parseInt(faker.random.number())
        );
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('Should successfully create a comment of comment', async () => {
      const article = initArticle();

      const parent = initComment();
      parent.article = article;

      const comment = initComment();
      comment.article = article;
      comment.parent = parent;

      jest
        .spyOn(commentsService, 'findOneOrThrowError')
        .mockResolvedValueOnce(parent);

      jest
        .spyOn(commentsService, 'create')
        .mockResolvedValueOnce(comment);

      const result = await commentsController.create({
        nickname: comment.nickname,
        content: comment.content
      },
        parent.id
      );

      expect(result).toBe(comment);
    });
  });

  describe('getChildrenComments function', () => {
    it('Should throw error when not found parent comment', async () => {
      jest
        .spyOn(commentsService, 'fetchDescendantsOfComment')
        .mockRejectedValueOnce(new NotFoundException());

      let error;

      try {
        await commentsController.getChildrenComments(1);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('Should return list of children comments', async () => {
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

      jest
        .spyOn(commentsService, 'fetchDescendantsOfComment')
        .mockResolvedValueOnce(comments);

      const result = await commentsController.getChildrenComments(parent.id);

      expect(result).toBe(comments);
    })
  });
});