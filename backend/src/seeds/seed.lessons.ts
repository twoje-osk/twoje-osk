import { Lesson } from '../lessons/entities/lesson.entity';
import { instructorsFactory } from './seed.instructors';
import { traineesFactory } from './seed.trainees';
import { Factory } from './seed.utils';
import { vehiclesFactory } from './seed.vehicles';

class LessonsFactory extends Factory<Lesson> {
  constructor() {
    super('Lessons');
  }

  public generate() {
    const lesson = new Lesson();
    this.entities.push(lesson);
    return lesson;
  }
}
export const lessonsFactory = new LessonsFactory();
export const seedLessons = () => [
  lessonsFactory.generateFromData({
    from: new Date('2022-07-05T10:00:00.00Z'),
    to: new Date('2022-07-05T11:00:00.00Z'),
    instructor: instructorsFactory.getAll()[0],
    trainee: traineesFactory.getAll()[0],
    vehicle: vehiclesFactory.getAll()[0],
  }),
  lessonsFactory.generateFromData({
    from: new Date('2022-07-05T13:00:00.00Z'),
    to: new Date('2022-07-05T14:00:00.00Z'),
    instructor: instructorsFactory.getAll()[0],
    trainee: traineesFactory.getAll()[0],
    vehicle: vehiclesFactory.getAll()[0],
  }),
  lessonsFactory.generateFromData({
    from: new Date('2022-07-05T17:00:00.00Z'),
    to: new Date('2022-07-05T18:00:00.00Z'),
    instructor: instructorsFactory.getAll()[0],
    trainee: traineesFactory.getAll()[0],
    vehicle: vehiclesFactory.getAll()[0],
  }),
];
