import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Trainee } from '../../trainees/entities/trainee.entity';
import { ColumnNumericTransformer } from '../../utils/ColumnNumericTransformer';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', {
    transformer: new ColumnNumericTransformer(),
    precision: 12,
    scale: 2,
  })
  amount: number;

  @Column({ default: '', length: 256 })
  note: string;

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
