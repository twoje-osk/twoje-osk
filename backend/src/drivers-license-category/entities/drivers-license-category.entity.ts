import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import type { Report } from '../../reports/entities/report.entity';

@Entity()
export class DriversLicenseCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @Exclude()
  @OneToMany<Report>('Report', (report) => report.driversLicenseCategory)
  reports: Report[];
}
