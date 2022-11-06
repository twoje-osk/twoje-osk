import { Exclude } from 'class-transformer';
import { Payment } from 'payments/entities/payment.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';

@Entity()
export class Trainee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pesel: string;

  @Column({ nullable: true, type: 'text' })
  driversLicenseNumber: string | null;

  @Column()
  pkk: string;

  @OneToOne<User>('User', (user) => user.trainee)
  user: User;

  @Exclude()
  @RelationId((trainee: Trainee) => trainee.user)
  userId: number;

  @OneToMany<Payment>('Payment', (payment) => payment.trainee)
  payments: Payment[];
}
