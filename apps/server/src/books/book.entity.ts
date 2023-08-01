import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Books {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column({
    default: '',
  })
  title: string;
  @Column({
    default: '',
  })
  author: string;
  @Column()
  author_id: number;
  @Column()
  publisher_id: number;
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
  contrributor: string;
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
