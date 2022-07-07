import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @ManyToOne(() => Instructor)
  @JoinColumn()
  instructor: Instructor;

  @ManyToOne(() => Trainee)
  @JoinColumn()
  trainee: Trainee;

  @ManyToOne(() => Vehicle)
  @JoinColumn()
  vehicle: Vehicle;
}
