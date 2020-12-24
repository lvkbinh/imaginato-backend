import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from 'typeorm';
import { Article } from '../articles/article.entity';

@Entity('comments')
@Tree('nested-set')
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id: number;
  
  @ApiProperty()
  @Column('varchar', {
    nullable: false,
    length: 255
  })
  nickname: string;

  @ApiProperty()
  @Column('text', {
    nullable: false
  })
  content: string;

  @ApiProperty()
  @Column('int', {
    nullable: false
  })
  articleId: number;

  @ApiProperty({ type: () => Article })
  @ManyToOne(() => Article, article => article.comments)
  @JoinColumn()
  article: Article;

  @ApiProperty({
    type: () => Comment,
    isArray: true
  })
  @TreeChildren()
  children: Comment[];

  @ApiProperty({ type: () => Comment })
  @TreeParent()
  parent: Comment;

  @ApiProperty()
  @CreateDateColumn(({
    type: 'timestamp'
  }))
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp'
  })
  updatedAt: Date;
}