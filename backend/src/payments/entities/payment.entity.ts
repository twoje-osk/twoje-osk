// import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  // RelationId,
} from 'typeorm';
import type { Trainee } from 'trainees/entities/trainee.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  date: Date;

  @ManyToOne<Trainee>('Trainee', (trainee) => trainee.payments)
  trainee: Trainee;

  @Exclude()
  @RelationId((payment: Payment) => payment.trainee)
  traineeId: number;
}
