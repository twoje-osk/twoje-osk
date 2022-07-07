import { Lesson } from '../lessons/entities/lesson.entity';
import { Factory } from './seed.utils';

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
    from: new Date('2022-07-05 10:00:00.00Z'),
    to: new Date('2022-07-05 11:00:00.00Z'),
  }),
  lessonsFactory.generateFromData({
    from: new Date('2022-07-05 13:00:00.00Z'),
    to: new Date('2022-07-05 14:00:00.00Z'),
  }),
  lessonsFactory.generateFromData({
    from: new Date('2022-07-05 17:00:00.00Z'),
    to: new Date('2022-07-05 18:00:00.00Z'),
  }),
];
