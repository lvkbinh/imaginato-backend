import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';

function EntityNotFound(message?: string) {
  this.name = 'EntityNotFound';
  this.message = message || '';
}
EntityNotFound.prototype = Error.prototype;

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

describe('Articles service', () => {
  let articlesService: ArticlesService;
  let articlesRepository: Repository<Article>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: getRepositoryToken(Article), useClass: Repository }
      ]
    }).compile();

    articlesService = module.get<ArticlesService>(ArticlesService);
    articlesRepository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  it('Service should be defined', () => {
    expect(articlesService).toBeDefined();
  });

  describe('create function', () => {
    it('Should successfully created an article', async () => {
      const article = initArticle();
  
      jest
        .spyOn(articlesRepository, 'save')
        .mockResolvedValueOnce(article);
  
      const result = await articlesService.create({
        title: article.title,
        nickname: article.nickname,
        content: article.content
      });
  
      expect(result).toBe(article);
    });
  });

  describe('fetchAll function', () => {
    it('Should return empty array', async () => {
      jest
        .spyOn(articlesRepository, 'find')
        .mockResolvedValueOnce([]);
      
      const result = await articlesService.fetchAll({
        take: 10,
        skip: 0,
        sort: 'createdAt:DESC'
      });

      expect(result.length).toBe(0);
    });

    it('Should return list articles', async () => {
      const article1 = initArticle();
      const article2 = initArticle();
      const articles = [article1, article2];

      jest
        .spyOn(articlesRepository, 'find')
        .mockResolvedValueOnce(articles);
      
      const result = await articlesService.fetchAll({
        take: 10,
        skip: 0,
        sort: 'createdAt:DESC'
      });

      expect(result.length).toBe(articles.length);
      expect(result[0]).toBe(article1);
      expect(result[1]).toBe(article2);
    });
  });

  describe('findOneOrThrowError function', () => {  
    it('Should successfully found an article', async () => {
      const article = initArticle();
  
      jest
        .spyOn(articlesRepository, 'findOneOrFail')
        .mockResolvedValueOnce(article);
  
      const result = await articlesService.findOneOrThrowError(article.id);

      expect(result).toBe(article);
    });

    it('Should throw error when not found an article', async () => {
      jest
        .spyOn(articlesRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new EntityNotFound());

      let error;

      try {
        await articlesService.findOneOrThrowError(1);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});