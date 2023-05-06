import { Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['description'])
export class ReportEntryGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(255)
  description: string;
}
