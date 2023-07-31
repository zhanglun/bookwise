import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  uuid: string;
  @Column()
  name: string;
  @Column()
  author: string;
  @Column()
  author_id: number;
  @Column()
  publisher_id: number;
  @Column()
  subject: string;
  @Column()
  description: string;
  @Column()
  contrributor: string;
  @Column()
  source: string;
  @Column()
  rights: string;
  @Column()
  path: string;
  @Column()
  publish_at: string;
  @Column()
  created_at: string;
  @Column()
  updated_at: string;
}
