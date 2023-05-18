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
import { DriversLicenseCategory } from '../../drivers-license-category/entities/drivers-license-category.entity';
import type { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity()
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne<User>('User', (user) => user.instructor)
  user: User;

  @Exclude()
  @RelationId((instructor: Instructor) => instructor.user)
  userId: number;

  @Column({ length: 10 })
  registrationNumber: string;

  @Column({ length: 6 })
  licenseNumber: string;

  @ManyToMany(() => DriversLicenseCategory)
  @JoinTable()
  instructorsQualifications: DriversLicenseCategory[];

  @RelationId((instructor: Instructor) => instructor.instructorsQualifications)
  instructorsQualificationsIds: number[];

  @Column({ nullable: true, type: 'text' })
  photo: string | null;

  @ManyToMany<Vehicle>(() => Vehicle)
  @JoinTable()
  favouriteVehicles: Vehicle[];

  @RelationId((instructor: Instructor) => instructor.favouriteVehicles)
  favouriteVehiclesIds: number[];
}
