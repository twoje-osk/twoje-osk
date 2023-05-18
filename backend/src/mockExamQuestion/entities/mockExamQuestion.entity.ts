import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { DriversLicenseCategory } from '../../drivers-license-category/entities/drivers-license-category.entity';
import type { MockExamQuestionAnswer } from '../../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { MockExamQuestionType } from './mockExamQuestionType.entity';

@Entity()
export class MockExamQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1024 })
  question: string;

  @Column()
  points: number;

  @Column({ nullable: true, length: 255 })
  mediaURL: string;

  @Column({ nullable: true, length: 128 })
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

  @ManyToOne(() => MockExamQuestionType, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'typeId' })
  type: MockExamQuestionType;

  @RelationId((question: MockExamQuestion) => question.type)
  typeId: number;

  @ManyToMany(() => DriversLicenseCategory, { onDelete: 'CASCADE' })
  @JoinTable()
  categories: DriversLicenseCategory[];

  @RelationId((question: MockExamQuestion) => question.categories)
  categoriesIds: number[];

  @OneToMany<MockExamQuestionAnswer>(
    'MockExamQuestionAnswer',
    (answer) => answer.question,
  )
  answers: MockExamQuestionAnswer[];

  @RelationId((question: MockExamQuestion) => question.answers)
  answersIds: number[];
}
