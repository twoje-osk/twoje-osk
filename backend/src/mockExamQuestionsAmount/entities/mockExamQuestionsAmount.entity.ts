import { DriversLicenseCategory } from 'driversLicenseCategory/entities/driversLicenseCategory.entity';
import { MockExamQuestionType } from 'mockExamQuestion/entities/mockExamQuestionType.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MockExamQuestionsAmount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  points: number;

  @Column()
  type: MockExamQuestionType;

  @Column()
  typeId: number;

  @Column()
  category: DriversLicenseCategory;

  @Column()
  categoryId: number;

  @Column()
  amount: number;
}
