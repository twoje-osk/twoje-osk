import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DriversLicenseCategory } from '../../drivers-license-category/entities/drivers-license-category.entity';
import { MockExamQuestionType } from '../../mockExamQuestion/entities/mockExamQuestionType.entity';

@Index('questions_amount_unique_index', ['points', 'typeId', 'categoryId'], {
  unique: true,
})
@Entity()
export class MockExamQuestionsAmount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  points: number;

  @ManyToOne<MockExamQuestionType>('MockExamQuestionType')
  type: MockExamQuestionType;

  @Column()
  typeId: number;

  @ManyToOne<DriversLicenseCategory>('DriversLicenseCategory')
  category: DriversLicenseCategory;

  @Column()
  categoryId: number;

  @Column()
  amount: number;
}
