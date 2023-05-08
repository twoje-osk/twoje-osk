import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  licensePlate: string;

  @Column()
  vin: string;

  @Column()
  dateOfNextCheck: Date;

  @Column({ nullable: true, type: 'text' })
  photo: string | null;

  @Column({ nullable: true, type: 'text' })
  additionalDetails: string | null;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  @RelationId((vehicle: Vehicle) => vehicle.organization)
  organizationId: number;
}
