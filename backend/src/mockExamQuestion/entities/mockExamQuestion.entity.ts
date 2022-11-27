import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { DriversLicenseCategory } from '../../driversLicenseCategory/entities/driversLicenseCategory.entity';
import type { MockExamQuestionAnswer } from '../../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { MockExamQuestionType } from './mockExamQuestionType.entity';

@Entity()
export class MockExamQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  points: number;

  @Column({ nullable: true })
  mediaURL: string;

  @Column({ nullable: true })
  mediaReference: string;

  @OneToOne<MockExamQuestionAnswer>(
    'MockExamQuestionAnswer',
    (answer) => answer.isCorrectAnswerOf,
    { nullable: false },
  )
  @JoinColumn()
  correctAnswer: MockExamQuestionAnswer;

  @Exclude()
  @RelationId((question: MockExamQuestion) => question.correctAnswer)
  correctAnswerId: number;

  @ManyToOne(() => MockExamQuestionType, { nullable: false })
  @JoinColumn({ name: 'typeId' })
  type: MockExamQuestionType;

  @Exclude()
  @RelationId((question: MockExamQuestion) => question.type)
  typeId: number;

  @ManyToMany(() => DriversLicenseCategory)
  @JoinTable()
  categories: DriversLicenseCategory[];

  @RelationId((question: MockExamQuestion) => question.categories)
  categoriesIds: number[];
}
