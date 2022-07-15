import { BaseEntity } from "typeorm";
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
  RelationId,
} from 'typeorm';
import type { Instructor } from '../../instructors/entities/instructor.entity.admin';
import type { Trainee } from '../../trainees/entities/trainee.entity.admin';
import { Organization } from '../../organizations/entities/organization.entity.admin';

@Entity()
export class User extends BaseEntity {
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

  @RelationId((person: User) => person.organization)
  @Column()
  organizationId: number;

  @Column()
  createdAt: Date;

  @Column()
  phoneNumber: string;

  @OneToOne<Trainee>('Trainee', (trainee) => trainee.user, {
    cascade: true,
  })
  @JoinColumn()
  trainee: Trainee | null;

  @RelationId((person: User) => person.trainee)
  @Column()
  traineeId: number;

  @OneToOne<Instructor>('Instructor', (instructor) => instructor.user, {
    cascade: true,
  })
  @JoinColumn()
  instructor: Instructor | null;

  @RelationId((person: User) => person.instructor)
  @Column()
  instructorId: number;
}
