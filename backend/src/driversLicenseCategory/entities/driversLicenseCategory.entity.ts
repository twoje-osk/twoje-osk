import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DriversLicenseCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;
}
