import { DriversLicenseCategory } from 'driversLicenseCategory/entities/driversLicenseCategory.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { driversLicenseCategoriesFactory } from './seed.driversLicenseCategories';
import { Factory } from './seed.utils';

class InstructorsFactory extends Factory<Instructor> {
  constructor() {
    super(Instructor);
  }

  public generate() {
    const instructor = new Instructor();
    const initialQualifications: DriversLicenseCategory[] = [];
    const categoryB = driversLicenseCategoriesFactory
      .getAll()
      .find((el) => el.name === 'B');
    initialQualifications.push(
      categoryB || driversLicenseCategoriesFactory.generate(),
    );
    instructor.registrationNumber = this.faker.random.numeric(6);
    instructor.licenseNumber = this.faker.random.alphaNumeric(10);
    instructor.instructorsQualifications = initialQualifications;
    const categoriesWithoutB = driversLicenseCategoriesFactory
      .getAll()
      .filter((el) => el.name !== 'B');
    instructor.instructorsQualifications =
      instructor.instructorsQualifications.concat(
        this.faker.helpers.arrayElements(
          categoriesWithoutB,
          this.faker.datatype.number({
            max: 5,
            min: 0,
          }),
        ),
      );
    this.entities.push(instructor);
    return instructor;
  }
}
export const instructorsFactory = new InstructorsFactory();
export const seedInstructors = () => undefined;
