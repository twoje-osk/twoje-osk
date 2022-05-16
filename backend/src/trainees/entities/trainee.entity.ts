import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Trainee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pesel: string;

  @Column({ nullable: true })
  driversLicenseNumber?: string;

  @Column()
  pkk: string;

  @OneToOne(() => User, (user) => user.trainee)
  @JoinColumn()
  user: User;
}
