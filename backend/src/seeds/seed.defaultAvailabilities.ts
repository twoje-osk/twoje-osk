import { Time } from '@osk/shared';
import { DefaultAvailability } from '../defaultAvailability/entities/defaultAvailability.entity';
import { instructorsFactory } from './seed.instructors';
import { Factory } from './seed.utils';

class DefaultAvailabilitiesFactory extends Factory<DefaultAvailability> {
  constructor() {
    super(DefaultAvailability);
  }

  public generate() {
    const availability = new DefaultAvailability();
    this.entities.push(availability);
    return availability;
  }
}
export const availabilitiesFactory = new DefaultAvailabilitiesFactory();

export const seedDefaultAvailabilities = () => {
  instructorsFactory.getAll().forEach((instructor) => {
    Array.from({ length: 5 }).forEach((_, dayOfWeek) =>
      availabilitiesFactory.generateFromData({
        from: new Time(10, 0, 0),
        to: new Time(18, 0, 0),
        instructor,
        dayOfWeek,
      }),
    );
  });
};
