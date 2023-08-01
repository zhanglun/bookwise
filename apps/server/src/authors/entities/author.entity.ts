import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Authors {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true,
  })
  name: string;
}
