import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Author } from '../authors/entities/author.entity';
import { Publisher } from '../publishers/entities/publisher.entity';
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: '',
  })
  title: string;

  @ManyToOne(() => Author, (author) => author.books)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  @Column({
    default: '',
  })
  subject: string;
  @Column({
    default: '',
  })
  description: string;
  @Column({
    default: '',
  })
  contributor: string;
  @Column({
    default: '',
  })
  source: string;
  @Column({
    default: '',
  })
  rights: string;
  @Column({
    default: '',
  })
  language_id: string;

  @Column({
    default: 'epub',
  })
  format: string;

  @Column({
    default: 0,
  })
  page_count: number;

  @Column({
    default: '',
  })
  isbn: string;
  @Column({
    default: '',
  })
  path: string;
  @Column({
    type: 'date',
  })
  publish_at: string;
  @CreateDateColumn()
  @Column({
    type: 'date',
    default: new Date().getTime(),
  })
  created_at: string;
  @UpdateDateColumn()
  @Column({
    type: 'date',
    default: new Date().getTime(),
  })
  updated_at: string;
}
