import { Entity, OneToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { User } from '../../users/entities/user.entity';

@Entity()
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne<User>('User', (user) => user.instructor)
  user: User;

  @Column({ nullable: true, type: 'text' })
  photo: string | null;
}
