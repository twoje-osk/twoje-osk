import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: Date;

  @Column()
  to: Date;

  @ManyToOne(() => Instructor)
  @JoinColumn()
  instructor: Instructor;

  @Exclude()
  @Column({ default: true })
  userDefined: boolean;
}
