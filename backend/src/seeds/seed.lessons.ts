import { setHours, startOfHour } from 'date-fns';
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

const today = startOfHour(new Date());
export const seedLessons = () => [
  lessonsFactory.generateFromData({
    from: setHours(today, 10),
    to: setHours(today, 11),
    instructor: instructorsFactory.getAll()[0],
    trainee: traineesFactory.getAll()[0],
    vehicle: vehiclesFactory.getAll()[0],
  }),
  lessonsFactory.generateFromData({
    from: setHours(today, 13),
    to: setHours(today, 14),
    instructor: instructorsFactory.getAll()[0],
    trainee: traineesFactory.getAll()[0],
    vehicle: vehiclesFactory.getAll()[0],
  }),
  lessonsFactory.generateFromData({
    from: setHours(today, 17),
    to: setHours(today, 18),
    instructor: instructorsFactory.getAll()[0],
    trainee: traineesFactory.getAll()[0],
    vehicle: vehiclesFactory.getAll()[0],
  }),
];
