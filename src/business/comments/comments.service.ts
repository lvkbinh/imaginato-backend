import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, IsNull, Repository } from 'typeorm';
import { Article } from '../articles/article.entity';
import { Comment } from './comment.entity';
import { CreateCommentDTO } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  save(input: Comment): Promise<Comment> {
    return this.commentsRepository.save(input);
  }

  async create(
    input: CreateCommentDTO,
    belongTo: {
      parent?: Comment,
      article?: Article
    }, 
  ): Promise<Comment> {
    const { nickname, content } = input;
    const { parent, article } = belongTo;

    const comment = new Comment();
    comment.nickname = nickname;
    comment.content = content;

    if (parent) {
      comment.parent = parent;
    }
    if (article) {
      comment.article = article;
    }

    return this.save(comment);
  }

  async findOneOrThrowError(criteria): Promise<Comment> {
    try {
      const record = await this.commentsRepository.findOneOrFail(criteria);
      return record;
    } catch (e) {
      if (e.name === 'EntityNotFound') {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }

  async fetchFullCommentsOfArticle(articleId): Promise<Comment[]> {
    const comments = await this.commentsRepository.find({
      parent: IsNull(),
      articleId
    });

    await Promise.all(
      comments.map(async comment => {
        comment.children = await this.fetchDescendantsOfComment(comment.id);
        return comment;
      })
    );

    return comments;
  }

  async fetchDescendantsOfComment(commentId): Promise<Comment[]> {
    const parent = await this.findOneOrThrowError(commentId);

    const manager = getManager();

    const comment = await manager
      .getTreeRepository(Comment)
      .findDescendantsTree(parent);

    return comment.children;
  }
}