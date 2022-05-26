import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
@Unique(['licensePlate'])
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licensePlate: string;

  @Column()
  notes?: string;

  @ManyToOne(() => Organization)
  organization: Organization;
}
