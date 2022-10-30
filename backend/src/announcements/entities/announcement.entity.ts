import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  body: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Exclude()
  @Column()
  @RelationId((announcement: Announcement) => announcement.createdBy)
  createdById: number;

  @Column()
  createdAt: Date;
}
