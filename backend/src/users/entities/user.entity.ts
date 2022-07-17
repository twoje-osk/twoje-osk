import { Exclude, Expose } from 'class-transformer';
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
import { UserRole } from '@osk/shared';
import type { Instructor } from '../../instructors/entities/instructor.entity';
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

  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Exclude()
  @RelationId((person: User) => person.organization)
  @Column({ nullable: false })
  organizationId: number;

  @Column()
  createdAt: Date;

  @Column()
  phoneNumber: string;

  @OneToOne<Trainee>('Trainee', (trainee) => trainee.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'traineeId' })
  trainee: Trainee | null;

  @Exclude()
  @RelationId((person: User) => person.trainee)
  @Column({ nullable: true })
  traineeId: number | null;

  @OneToOne<Instructor>('Instructor', (instructor) => instructor.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'instructorId' })
  instructor: Instructor | null;

  @Exclude()
  @RelationId((person: User) => person.instructor)
  @Column({ nullable: true })
  instructorId: number | null;

  @Expose()
  get role(): UserRole {
    if (this.traineeId !== null) {
      return UserRole.Trainee;
    }

    if (this.instructorId !== null) {
      return UserRole.Instructor;
    }

    return UserRole.Admin;
  }
}
