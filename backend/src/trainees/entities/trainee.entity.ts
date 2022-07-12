import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
