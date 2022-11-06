import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Trainee } from '../../trainees/entities/trainee.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  date: Date;

  @ManyToOne<Trainee>('Trainee', (trainee) => trainee.payments, {
    nullable: false,
  })
  trainee: Trainee;

  @Exclude()
  @RelationId((payment: Payment) => payment.trainee)
  traineeId: number;
}
