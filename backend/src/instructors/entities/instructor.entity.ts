import {
  Entity,
  OneToOne,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { DriversLicenseCategory } from '../../driversLicenseCategory/entities/driversLicenseCategory.entity';
import type { User } from '../../users/entities/user.entity';

@Entity()
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne<User>('User', (user) => user.instructor)
  user: User;

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
