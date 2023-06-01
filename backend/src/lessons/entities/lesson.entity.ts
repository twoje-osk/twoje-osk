import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonStatus } from '@osk/shared';
import { Exclude } from 'class-transformer';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Instructor } from '../../instructors/entities/instructor.entity';
import { Trainee } from '../../trainees/entities/trainee.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: Date;

  @Column()
  to: Date;

  @Column({
    enum: LessonStatus,
    default: LessonStatus.Requested,
  })
  status: LessonStatus;

  @ManyToOne(() => Instructor, { nullable: false })
  @JoinColumn({ name: 'instructorId' })
  instructor: Instructor;

  @Exclude()
  @Column()
  instructorId: number;

  @ManyToOne(() => Trainee, { nullable: false })
  @JoinColumn({ name: 'traineeId' })
  trainee: Trainee;

  @Exclude()
  @Column()
  traineeId: number;

  @Exclude()
  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle | null;

  @Column({ nullable: true })
  vehicleId: number | null;
}
