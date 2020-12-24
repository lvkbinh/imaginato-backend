import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Comment } from '../comments/comment.entity';

@Entity('articles')
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id: number;

  @ApiProperty()
  @Column('nvarchar', {
    nullable: false,
    length: 255
  })
  title: string;
  
  @ApiProperty()
  @Column('nvarchar', {
    nullable: false,
    length: 255
  })
  nickname: string;

  @ApiProperty()
  @Column('text', {
    nullable: false
  })
  content: string;

  @ApiProperty({
    type: () => Comment,
    isArray: true
  })
  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

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