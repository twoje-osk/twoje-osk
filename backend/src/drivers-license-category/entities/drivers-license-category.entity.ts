import { Report } from 'reports/entities/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class DriversLicenseCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @OneToMany<Report>('Report', (report) => report.driversLicenseCategory)
  reports: Report[];
}
