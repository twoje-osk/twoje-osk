import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DriversLicenseCategory } from '../../driversLicenseCategory/entities/driversLicenseCategory.entity';
import { MockExamQuestionType } from '../../mockExamQuestion/entities/mockExamQuestionType.entity';

@Entity()
export class MockExamQuestionsAmount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  points: number;

  @OneToOne<MockExamQuestionType>('MockExamQuestionType')
  type: MockExamQuestionType;

  @Column()
  typeId: number;

  @OneToOne<DriversLicenseCategory>('DriversLicenseCategory')
  category: DriversLicenseCategory;

  @Column()
  categoryId: number;

  @Column()
  amount: number;
}
