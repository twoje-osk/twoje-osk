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
  @Column({ length: 255 })
  email: string;

  @Exclude()
  @Column({ nullable: true, type: 'varchar', length: 255 })
  password: string | null;

  @Column({ length: 64 })
  firstName: string;

  @Column({ length: 64 })
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

  @Column({ length: 12 })
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
