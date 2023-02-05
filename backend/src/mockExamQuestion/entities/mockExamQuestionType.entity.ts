import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MockExamQuestionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scope: string;

  @Column()
  timeToReadTheQuestion: number;

  @Column()
  timeToAnswer: number;
}
