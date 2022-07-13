import { Instructor } from '../instructors/entities/instructor.entity';
import { Factory } from './seed.utils';

class InstructorsFactory extends Factory<Instructor> {
  constructor() {
    super(Instructor);
  }

  public generate() {
    const instructor = new Instructor();
    this.entities.push(instructor);
    return instructor;
  }
}
export const instructorsFactory = new InstructorsFactory();
export const seedInstructors = () => undefined;
