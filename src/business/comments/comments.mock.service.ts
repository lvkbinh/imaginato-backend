import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsMockService {
  create(input) {
    return;
  }

  findOneOrThrowError(criteria) {
    return;
  }

  fetchFullCommentsOfArticle(articleId) {
    return;
  }

  fetchDescendantsOfComment(commentId) {
    return;
  }
}