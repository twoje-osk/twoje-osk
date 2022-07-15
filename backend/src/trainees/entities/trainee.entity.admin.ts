import { BaseEntity } from "typeorm";
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.admin';

@Entity()
export class Trainee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pesel: string;

  @Column({ nullable: true, type: 'text' })
  driversLicenseNumber: string | null;

  @Column()
  pkk: string;

  @OneToOne<User>('User', (user) => user.trainee)
  user: User;

  @Exclude()
  @RelationId((trainee: Trainee) => trainee.user)
  userId: number;
}
