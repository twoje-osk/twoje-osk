import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['description'])
export class ReportEntryGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;
}
