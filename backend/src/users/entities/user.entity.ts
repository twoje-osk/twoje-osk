import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
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

  @Exclude()
  @Column({ nullable: true, type: 'varchar' })
  password: string | null;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Exclude()
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
  @Column({ nullable: true })
  traineeId: number | null;

  @OneToOne<Instructor>('Instructor', (instructor) => instructor.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'instructorId' })
  instructor: Instructor | null;

  @Exclude()
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
