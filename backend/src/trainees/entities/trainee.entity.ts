import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { CourseReport } from '../../course-reports/entities/course-report.entity';
import type { Payment } from '../../payments/entities/payment.entity';
import type { User } from '../../users/entities/user.entity';

@Entity()
export class Trainee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'text' })
  pesel: string | null;

  @Column({ nullable: true, type: 'text' })
  driversLicenseNumber: string | null;

  @Column()
  pkk: string;

  @Column()
  dateOfBirth: Date;

  @OneToOne<User>('User', (user) => user.trainee)
  user: User;

  @Exclude()
  @RelationId((trainee: Trainee) => trainee.user)
  userId: number;

  @OneToMany<Payment>('Payment', (payment) => payment.trainee)
  payments: Payment[];

  @OneToOne<CourseReport>(
    'CourseReport',
    (courseReport) => courseReport.trainee,
    { nullable: true },
  )
  courseReport: CourseReport | null;
}
