import {
  Entity,
  OneToOne,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { DriversLicenseCategory } from '../../driversLicenseCategory/entities/driversLicenseCategory.entity';
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

  @Column({ type: 'text' })
  registrationNumber: string;

  @Column({ type: 'text' })
  licenseNumber: string;

  @ManyToMany(() => DriversLicenseCategory)
  @JoinTable()
  instructorsQualifications: DriversLicenseCategory[];

  @Column({ nullable: true, type: 'text' })
  photo: string | null;
}
