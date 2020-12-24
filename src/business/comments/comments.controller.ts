import { Body, Controller, Param, Post, Get, InternalServerErrorException } from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @ApiCreatedResponse({ type: Comment })
  @ApiNotFoundResponse({ description: 'Not found parent comment' })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error happened' })
  @Post(':id/comments')
  async create(
    @Body() reqBody: CreateCommentDTO,
    @Param('id') id: number
  ): Promise<Comment> {
    try {
      const parent = await this.commentsService.findOneOrThrowError({
        where: { id },
        relations: ['article']
      });

      const comment = await this.commentsService.create(
        reqBody,
        {
          parent: parent,
          article: parent.article
        }
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

  @ApiOkResponse({ type: [Comment] })
  @ApiNotFoundResponse({ description: 'Not found parent comment' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error happened' })
  @Get(':id/comments')
  async getChildrenComments(
    @Param('id') id: number
  ): Promise<Comment[]> {
    try {
      const comments = await this.commentsService.fetchDescendantsOfComment(id);

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