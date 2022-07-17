import { Exclude } from 'class-transformer';
import { Entity, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import type { User } from '../../users/entities/user.entity';

@Entity()
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne<User>('User', (user) => user.instructor)
  user: User;

  @Exclude()
  @RelationId((instructor: Instructor) => instructor.user)
  userId: number;
}
