import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ResetPasswordToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  token: string;

  @Column()
  isValid: boolean;

  @Column()
  expireDate: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Exclude()
  @RelationId(
    (resetPasswordToken: ResetPasswordToken) => resetPasswordToken.user,
  )
  userId: number;
}
