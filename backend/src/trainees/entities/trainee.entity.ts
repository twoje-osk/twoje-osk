import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { CourseReport } from '../../course-reports/entities/course-report.entity';
import { DriversLicenseCategory } from '../../drivers-license-category/entities/drivers-license-category.entity';
import type { Payment } from '../../payments/entities/payment.entity';
import type { User } from '../../users/entities/user.entity';

@Entity()
export class Trainee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 11 })
  pesel: string | null;

  @Column({ nullable: true, length: 32 })
  driversLicenseNumber: string | null;

  @Column({ length: 20 })
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

  @Exclude()
  @ManyToOne<DriversLicenseCategory>('DriversLicenseCategory', {
    nullable: false,
  })
  driversLicenseCategory: DriversLicenseCategory;

  @RelationId((trainee: Trainee) => trainee.driversLicenseCategory)
  driversLicenseCategoryId: number;
}
