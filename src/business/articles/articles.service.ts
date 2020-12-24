import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDTO } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>
  ) {}

  save(input: Article): Promise<Article> {
    return this.articlesRepository.save(input);
  }

  async create(input: CreateArticleDTO): Promise<Article> {
    const { title, nickname, content } = input;

    const article = new Article();
    article.title = title;
    article.nickname = nickname;
    article.content = content;

    return this.save(article);
  }

  async fetchAll(filters?: {
    take?: number,
    skip?: number,
    sort?: string
  }): Promise<Article[]> {
    const { skip, take, sort } = filters || {};

    const criteria: {
      select?: any,
      take?: number,
      skip?: number,
      order?: any
    } = {
      select: ['title', 'nickname', 'createdAt']
    };

    if (take >= 0) {
      criteria.take = take;
    }
    if (skip >= 0) {
      criteria.skip = skip;
    }
    if (sort) {
      const sortByFieldName = sort.split(':')[0];
      const sortDir = sort.split(':')[1];
      criteria.order = { [sortByFieldName] : sortDir.toUpperCase() };
    }

    return this.articlesRepository.find(criteria);
  }

  async findOneOrThrowError(criteria): Promise<Article> {
    try {
      const record = await this.articlesRepository.findOneOrFail(criteria);
      return record;
    } catch (e) {
      if (e.name === 'EntityNotFound') {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
}