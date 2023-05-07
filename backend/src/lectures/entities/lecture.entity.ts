import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  index: number;

  @Column()
  body: string;
}
