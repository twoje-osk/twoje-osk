import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import type { Trainee } from '../../trainees/entities/trainee.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Organization)
  organization: Organization;

  @OneToOne(() => Organization)
  @JoinColumn()
  trainee: Trainee;
}