import { Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportEntryGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(255)
  description: string;
}
