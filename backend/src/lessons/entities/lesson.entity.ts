import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { LessonStatus } from '@osk/shared';
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
  @JoinColumn()
  instructor: Instructor;

  @RelationId((lesson: Lesson) => lesson.instructor)
  instructorId: number;

  @ManyToOne(() => Trainee, { nullable: false })
  @JoinColumn()
  trainee: Trainee;

  @RelationId((lesson: Lesson) => lesson.trainee)
  traineeId: number;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn()
  vehicle: Vehicle | null;
}
