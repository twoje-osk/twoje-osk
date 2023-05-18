import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;

  @Index({ unique: true })
  @Column({ unique: true, length: 64 })
  slug: string;

  @Column({ default: true })
  isEnabled: boolean;
}
