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

  @Column({ length: 64 })
  name: string;

  @Column({ length: 7 })
  licensePlate: string;

  @Column({ length: 17 })
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
