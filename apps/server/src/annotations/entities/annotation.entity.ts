import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from "../../books/entities/book.entity";

@Entity('annotations')
export class Annotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: '',
  })
  title: string;

  @Column({
    default: '',
  })
  content: string;

  @Column({
    default: '',
  })
  note: string;

  // @ManyToOne(() => Author, (author) => author.books)
  // @JoinColumn({ name: 'author_id' })
  // author: Author;

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
