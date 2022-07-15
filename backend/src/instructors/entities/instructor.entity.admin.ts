import { BaseEntity } from "typeorm";
import { Exclude } from 'class-transformer';
import { Entity, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import type { User } from '../../users/entities/user.entity.admin';

@Entity()
export class Instructor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne<User>('User', (user) => user.instructor)
  user: User;

  @Exclude()
  @RelationId((instructor: Instructor) => instructor.user)
  userId: number;
}
