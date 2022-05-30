import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
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
