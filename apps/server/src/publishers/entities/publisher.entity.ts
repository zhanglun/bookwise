import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Publishers {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true,
  })
  name: string;
}
