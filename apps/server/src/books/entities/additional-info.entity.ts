import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('additional_infos')
export class AdditionalInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({
    default: '',
  })
  spine_index: string;

  @Column({
    default: 0,
  })
  read_progress: number;

  @UpdateDateColumn()
  @Column({
    type: 'date',
    default: new Date().getTime(),
  })
  read_progress_updated_at: string;
}
