import { BaseEntity } from "typeorm";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity.admin';

@Entity()
export class Vehicle extends BaseEntity {
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
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @RelationId((vehicle: Vehicle) => vehicle.organization)
  @Column()
  organizationId: number;
}
